import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { screenFindings } from "./screens.mjs";

const USAGE = "usage: check-screens.mjs <screensDir> [--allow <module>]...";

async function sources(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") files.push(...(await sources(path)));
    else if (entry.isFile() && entry.name.endsWith(".tsx")) files.push(path);
  }
  return files.sort();
}

/** The nearest directory at or above `start` that has a package.json; the working directory otherwise. */
function projectRoot(start) {
  for (let dir = start; ; dir = dirname(dir)) {
    if (existsSync(join(dir, "package.json"))) return dir;
    if (dirname(dir) === dir) return process.cwd();
  }
}

async function check() {
  const args = process.argv.slice(2);
  const allow = [];
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--allow") {
      const module = args[(index += 1)];
      if (!module) throw new Error(USAGE);
      allow.push(module);
    } else positional.push(args[index]);
  }
  if (positional.length !== 1) throw new Error(USAGE);
  const directory = resolve(positional[0]);
  if (!existsSync(directory)) throw new Error(`${positional[0]}: no such directory`);
  const root = projectRoot(directory);
  let typescript;
  try {
    typescript = createRequire(join(root, "package.json"))("typescript");
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND")
      throw new Error("TypeScript parser is not installed in the consumer project; install typescript to run check-screens.");
    throw error;
  }
  let count = 0;
  for (const path of await sources(directory)) {
    const file = relative(process.cwd(), path).split(sep).join("/");
    for (const finding of screenFindings(file, await readFile(path, "utf8"), typescript, { allow })) {
      const warning = finding.severity === "warning";
      console.log(`${finding.file}:${finding.line}:${finding.column} ${warning ? "warning " : ""}${finding.rule} ${finding.message}`);
      if (!warning) count += 1;
    }
  }
  console.log(count === 0 ? "screens: ok" : `screens: ${count} finding(s)`);
  process.exitCode = count > 0 ? 1 : 0;
}

try {
  await check();
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
