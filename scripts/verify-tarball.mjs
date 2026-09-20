import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const textExtensions = new Set([".css", ".d.ts", ".js", ".json", ".map", ".mjs", ".ts"]);

const allowedPath = /^(?:README\.md|LICENSE|package\.json|dist(?:\/|$))/;
const credentialLike = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i,
  /\bnpm_[A-Za-z0-9]{8,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
];

export function assertPackFiles(files) {
  const unexpected = files.filter((file) => {
    const path = typeof file === "string" ? file : file.path;
    return typeof path !== "string" || !allowedPath.test(path.replace(/^package\//, ""));
  });
  assert.equal(unexpected.length, 0, `unexpected files in npm tarball: ${unexpected.join(", ")}`);
}

export function assertNoSecrets(entries) {
  for (const entry of entries) {
    const match = credentialLike.find((pattern) => pattern.test(entry.text));
    assert.equal(match, undefined, `credential-like content in ${entry.path}`);
  }
}

async function run(command, args, options = {}) {
  return execFileAsync(command, args, { cwd: packageRoot, ...options });
}

async function collectTextFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...(await collectTextFiles(path, relative)));
    else if (textExtensions.has(resolve(entry.name).slice(resolve(entry.name).lastIndexOf(".")))) {
      files.push({ path: relative, text: await readFile(path, "utf8") });
    }
  }
  return files;
}

async function main() {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "uiify-tarball-"));
  try {
    const packDirectory = join(temporaryRoot, "pack");
    const extractDirectory = join(temporaryRoot, "extract");
    const consumerDirectory = join(temporaryRoot, "consumer");
    await Promise.all([
      import("node:fs/promises").then(({ mkdir }) => mkdir(packDirectory)),
      import("node:fs/promises").then(({ mkdir }) => mkdir(extractDirectory)),
      import("node:fs/promises").then(({ mkdir }) => mkdir(consumerDirectory)),
    ]);

    const { stdout } = await run("npm", [
      "pack",
      "--json",
      "--ignore-scripts",
      "--pack-destination",
      packDirectory,
    ]);
    const report = JSON.parse(stdout);
    const packed = report[0];
    assert.ok(packed?.filename, "npm pack did not return a tarball filename");
    assertPackFiles(packed.files ?? []);

    const tarball = join(packDirectory, packed.filename);
    await run("tar", ["-xzf", tarball, "-C", extractDirectory]);
    const packageDirectory = join(extractDirectory, "package");
    assertNoSecrets(await collectTextFiles(packageDirectory));

    await run(
      "npm",
      [
        "install",
        "--ignore-scripts",
        "--no-package-lock",
        "--prefix",
        consumerDirectory,
        tarball,
        "react@19.3.0",
        "react-dom@19.3.0",
        "typescript@5.9.3",
        "@types/react@19.3.0",
        "@types/react-dom@19.3.0",
      ],
      { cwd: consumerDirectory },
    );

    const smokeModule = join(consumerDirectory, "smoke.mjs");
    await writeFile(
      smokeModule,
      [
        'import "@gunkin/uiify";',
        'import "@gunkin/uiify/components/button";',
        'import "@gunkin/uiify/elements/dialog";',
        'import "@gunkin/uiify/core/render";',
        'import "@gunkin/uiify/hooks";',
        'for (const specifier of ["@gunkin/uiify/components/behavior.css", "@gunkin/uiify/styles", "@gunkin/uiify/styles/tokens", "@gunkin/uiify/styles/reset"]) {',
        "  if (!import.meta.resolve(specifier)) throw new Error(`unresolved ${specifier}`);",
        "}",
      ].join("\n"),
    );
    await execFileAsync(process.execPath, [smokeModule], { cwd: consumerDirectory });

    const typeSmoke = join(consumerDirectory, "smoke.ts");
    await writeFile(
      typeSmoke,
      [
        'import { Button } from "@gunkin/uiify/components/button";',
        'import type { RenderableProps } from "@gunkin/uiify/core/render";',
        'const props: RenderableProps<"button", { children?: string }, Record<string, never>, HTMLButtonElement> = { children: "Save" };',
        "void Button;",
        "void props;",
      ].join("\n"),
    );
    await execFileAsync(
      join(consumerDirectory, "node_modules/.bin/tsc"),
      [
        "--noEmit",
        "--module",
        "ESNext",
        "--moduleResolution",
        "bundler",
        "--jsx",
        "react-jsx",
        "--strict",
        "--skipLibCheck",
        typeSmoke,
      ],
      { cwd: consumerDirectory },
    );

    console.log(
      JSON.stringify(
        {
          version: packed.version,
          filename: packed.filename,
          integrity: packed.integrity,
          size: packed.size,
          unpackedSize: packed.unpackedSize,
          files: packed.files?.length ?? 0,
          imports: "root, components/button, elements/dialog, core/render, hooks",
          css: "behavior.css, styles, styles/tokens, styles/reset",
          secrets: "none detected",
        },
        null,
        2,
      ),
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
