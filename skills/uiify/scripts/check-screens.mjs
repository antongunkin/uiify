import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { installedUiifyNames, loadTypeScript, projectComponents } from "./project-catalog.mjs";
import { cssFindings, projectCssFiles } from "./project-css.mjs";
import { activeFindings, screenFindings } from "./screens.mjs";

const USAGE = "usage: check-screens.mjs <screensDir> [--allow <module>]... [--no-tsc]";
const MAX_TYPE_ERRORS = 20;

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

/**
 * The project's type check, as `tsc --noEmit -p <root>` runs it, so the agent needs one command, not two.
 * Returns the error diagnostics, or null when the project has no tsconfig.json.
 */
function typeErrors(typescript, root) {
  const configPath = typescript.findConfigFile(root, typescript.sys.fileExists, "tsconfig.json");
  if (!configPath) return null;
  const { config, error } = typescript.readConfigFile(configPath, typescript.sys.readFile);
  if (error) return [error];
  const parsed = typescript.parseJsonConfigFileContent(config, typescript.sys, dirname(configPath));
  const program = typescript.createProgram({
    rootNames: parsed.fileNames,
    // A plain program has no build-info file: `incremental` and `composite` would fail with TS5074/TS6304.
    options: { ...parsed.options, noEmit: true, incremental: false, composite: false },
    projectReferences: parsed.projectReferences,
  });
  const errors = [...parsed.errors, ...typescript.getPreEmitDiagnostics(program)];
  return errors.filter((diagnostic) => diagnostic.category === typescript.DiagnosticCategory.Error);
}

/** With TypeScript 7 the check parses with the `@typescript/typescript6` API; the type check stays the project's own `tsc`. */
function isTypeScript7(root) {
  try {
    return typeof createRequire(join(root, "package.json"))("typescript").createSourceFile !== "function";
  } catch {
    return false;
  }
}

function printTypeError(typescript, diagnostic) {
  const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, " ");
  if (!diagnostic.file || diagnostic.start === undefined) return console.log(`tsc TS${diagnostic.code} ${message}`);
  const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  const file = relative(process.cwd(), diagnostic.file.fileName).split(sep).join("/");
  console.log(`${file}:${line + 1}:${character + 1} tsc TS${diagnostic.code} ${message}`);
}

/** `active.ts` of a feature: the file that picks the product's design, next to `contract.ts`. */
const isActive = (path) => basename(path) === "active.ts" && existsSync(join(dirname(path), "contract.ts"));

async function check() {
  const args = process.argv.slice(2);
  const allow = [];
  const positional = [];
  let runTsc = true;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--no-tsc") runTsc = false;
    else if (args[index] === "--allow") {
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
  const summary = count === 0 ? "screens: ok" : `screens: ${count} finding(s)`;
  if (!runTsc || isTypeScript7(root)) {
    console.log(runTsc ? `${summary}, tsc: TypeScript 7, run tsc yourself` : summary);
    process.exitCode = count > 0 ? 1 : 0;
    return;
  }
  const errors = typeErrors(typescript, root);
  for (const diagnostic of (errors ?? []).slice(0, MAX_TYPE_ERRORS)) printTypeError(typescript, diagnostic);
  if (errors && errors.length > MAX_TYPE_ERRORS) console.log(`tsc: ${errors.length - MAX_TYPE_ERRORS} more error(s)`);
  const tsc = errors === null ? "tsc: no tsconfig.json" : errors.length === 0 ? "tsc: ok" : `tsc: ${errors.length} error(s)`;
  console.log(`${summary}, ${tsc}`);
  process.exitCode = count > 0 || (errors?.length ?? 0) > 0 ? 1 : 0;
}

try {
  await check();
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
