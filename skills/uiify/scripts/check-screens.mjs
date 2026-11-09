import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { installedUiifyNames, loadTypeScript, projectComponents } from "./project-catalog.mjs";
import { cssFindings, projectCssFiles } from "./project-css.mjs";
import { activeFindings, screenFindings } from "./screens.mjs";

const USAGE = "usage: check-screens.mjs <screensDir> [--allow <module>]...";

async function sources(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") files.push(...(await sources(path)));
    else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name === "active.ts")) files.push(path);
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


/** A design is a `.tsx` file in a `designs/` folder that has `contract.ts` next to it; returns the contract source. */
async function designContract(path) {
  const folder = dirname(path);
  if (basename(folder) !== "designs") return undefined;
  const contract = join(dirname(folder), "contract.ts");
  return existsSync(contract) ? readFile(contract, "utf8") : undefined;
}

/** `active.ts` of a feature: the file that picks the product's design, next to `contract.ts`. */
const isActive = (path) => basename(path) === "active.ts" && existsSync(join(dirname(path), "contract.ts"));

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
  const typescript = loadTypeScript(root);
  // Project modules screens may import: package.json `uiify.components`, then `--allow`.
  allow.unshift(...projectComponents(root));
  const uiifyNames = installedUiifyNames(root);
  let count = 0;
  const checked = [];
  for (const path of await sources(directory)) {
    if (path.endsWith(".ts") && !isActive(path)) continue;
    checked.push(path);
  }
  // The project's CSS styles UIify only through shadcn/Tailwind tokens, never its internals.
  for (const path of [...checked, ...projectCssFiles(root)]) {
    const file = relative(process.cwd(), path).split(sep).join("/");
    const source = await readFile(path, "utf8");
    const findings = path.endsWith(".css")
      ? cssFindings(file, source)
      : isActive(path)
        ? activeFindings(file, source, typescript)
        : screenFindings(file, source, typescript, { allow, contract: await designContract(path), root: directory, path, uiifyNames });
    for (const finding of findings) {
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
