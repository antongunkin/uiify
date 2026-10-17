import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, relative, resolve, sep } from "node:path";
import { staticChecks } from "./static.mjs";

const enabledIds = new Set(["no-positive-tabindex","button-type"]);
const excluded = new Set(["node_modules", ".git", ".next", ".turbo", "dist", "build", "coverage"]);

async function sources(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !excluded.has(entry.name)) files.push(...(await sources(path)));
    else if (
      entry.isFile() &&
      [".tsx", ".jsx", ".ts", ".js", ".mts", ".cts", ".mjs", ".cjs"].includes(extname(path))
    )
      files.push(path);
  }
  return files.sort();
}

async function lint() {
  const root = resolve(process.argv[2] ?? ".");
  let typescript;
  try {
    typescript = createRequire(join(root, "package.json"))("typescript");
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND")
      throw new Error(
        "TypeScript parser is not installed in the consumer project; install typescript to run lint.",
      );
    throw error;
  }
  const checks = staticChecks.filter((check) => enabledIds.has(check.id));
  let count = 0;
  for (const path of await sources(root)) {
    const source = await readFile(path, "utf8");
    const file = relative(root, path).split(sep).join("/");
    for (const check of checks) {
      for (const finding of check.run({ source, file, typescript }).findings) {
        console.log(`${finding.file}:${finding.line} ${finding.rule}: ${finding.message}`);
        count += 1;
      }
    }
  }
  console.log(`${count} findings (${checks.length} accepted static checks: ${checks.map((check) => check.id).join(", ") || "none"}).`);
  process.exitCode = count > 0 ? 1 : 0;
}

try {
  await lint();
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
