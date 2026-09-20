import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsc = process.argv[2];
if (!tsc) throw new Error("finish-build requires the resolved TypeScript CLI path");
await execFileAsync(process.execPath, [tsc, "-p", "tsconfig.build.json"], {
  cwd: root,
  maxBuffer: 10 * 1024 * 1024,
});

/**
 * Write a flat `dist/<layer>/<name>.{js,d.ts}` facade re-exporting
 * `dist/<layer>/<name>/index.{js,d.ts}`, for every name in `names`. Lets the
 * package.json `"./<layer>/*"` export map wildcard resolve `@gunkin/uiify/<layer>/<name>`
 * to a single file instead of `<name>/index`.
 */
async function writePublicWrappers(layer, names) {
  for (const name of names) {
    const leaf = name.slice(name.lastIndexOf("/") + 1);
    for (const extension of ["js", "d.ts"]) {
      const canonical = resolve(root, `dist/${layer}/${name}/index.${extension}`);
      const wrapper = resolve(root, `dist/${layer}/${name}.${extension}`);
      if (!existsSync(canonical)) throw new Error(`Missing public entry: ${canonical}`);
      // A real source file must never be overwritten by a generated facade.
      for (const sourceExtension of ["ts", "tsx"]) {
        if (existsSync(resolve(root, `src/${layer}/${name}.${sourceExtension}`))) {
          throw new Error(`Public wrapper collides with source: ${layer}/${name}`);
        }
      }
      await writeFile(wrapper, `export * from "./${leaf}/index.js";\n`);
    }
  }
}

const tierManifest = JSON.parse(await readFile(resolve(root, "src/component-tiers.json"), "utf8"));
await writePublicWrappers("components", [
  ...Object.keys(tierManifest.components),
  "enhance",
  "modal/client",
  "rating/client",
  "candle-chart/client",
  "line-chart/client",
  "carousel/client",
  "carousel/fade",
  "segmented-control/client",
  "toggle-group/client",
]);

const elementManifest = JSON.parse(
  await readFile(resolve(root, "src/elements/element-manifest.json"), "utf8"),
);
await writePublicWrappers("elements", Object.keys(elementManifest.elements));

const { stdout, stderr } = await execFileAsync(process.execPath, ["scripts/build.mjs"], {
  cwd: root,
});
process.stdout.write(stdout);
process.stderr.write(stderr);
