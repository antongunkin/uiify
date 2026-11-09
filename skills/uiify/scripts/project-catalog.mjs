/**
 * The project's own components that screens may use (package.json `uiify.components`), listed for the
 * agent from their TypeScript types, the way the UIify catalog lists UIify's. Shipped in the skill as
 * `scripts/project-catalog.mjs`; the consumer's TypeScript is passed in.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

/** The section stays small next to the UIify catalog; sync-agents warns above it. */
export const PROJECT_CATALOG_BYTE_LIMIT = 3072;

/** Props an agent never writes in a screen, or that every element takes anyway. */
const SKIP = /^(?:className|style|render|children|ref|key|asChild|on[A-Z].*|aria-.*|data-.*)$/;
const MAX_TYPE = 40;
/** A union of more string literals than this is noise for the agent (a locale's numeral systems, say). */
const MAX_LITERALS = 8;
/** Said once per client module: a server page that imports its client-only children (recharts) fails `next build`. */
const CLIENT_NOTE = '(client module: plain props work anywhere; client-only children go in a "use client" file)';

/**
 * The project's TypeScript parser API. TypeScript 7 exports only its version from the main
 * entry, so fall back to `@typescript/typescript6`, the official package with the 6.0 API.
 */
export function loadTypeScript(root) {
  const require = createRequire(join(root, "package.json"));
  const found = [];
  for (const id of ["typescript", "@typescript/typescript6"]) {
    let typescript;
    try {
      typescript = require(id);
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") continue;
      throw error;
    }
    if (typeof typescript.createSourceFile === "function") return typescript;
    found.push(`${id}@${typescript.version ?? "?"}`);
  }
  throw new Error(
    found.length > 0
      ? `${found.join(", ")} has no parser API (TypeScript 7 exports only its version): run npm i -D @typescript/typescript6`
      : "TypeScript is not installed in the consumer project: run npm i -D typescript (with TypeScript 7, also @typescript/typescript6)",
  );
}

/** `uiify.components` from the project's package.json: module specifiers, exact or ending in `*`. */
export function projectComponents(root) {
  const path = join(root, "package.json");
  if (!existsSync(path)) return [];
  const components = JSON.parse(readFileSync(path, "utf8")).uiify?.components;
  return Array.isArray(components) ? components.filter((entry) => typeof entry === "string") : [];
}

/** UIify's catalog names (`agents/names.json` of the installed package), or undefined without it. */
export function installedUiifyNames(root) {
  try {
    const manifest = createRequire(join(root, "package.json")).resolve("@gunkin/uiify/package.json");
    const path = join(dirname(manifest), "agents/names.json");
    return existsSync(path) ? new Set(JSON.parse(readFileSync(path, "utf8"))) : undefined;
  } catch {
    return undefined;
  }
}

function compilerOptions(ts, root) {
  const configPath = ["tsconfig.app.json", "tsconfig.json"].map((name) => join(root, name)).find((path) => existsSync(path));
  if (!configPath) return { options: { jsx: ts.JsxEmit.Preserve }, base: root };
  const parsed = ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, dirname(configPath));
  return { options: parsed.options, base: dirname(configPath) };
}

/** The folder an entry `X*` points at, through tsconfig `paths` or relative to the project. */
function wildcardFolder(prefix, root, { options, base }) {
  if (prefix.startsWith("./") || prefix.startsWith("../")) return resolve(root, prefix);
  for (const [pattern, targets] of Object.entries(options.paths ?? {})) {
    if (!pattern.endsWith("*") || !prefix.startsWith(pattern.slice(0, -1)) || !targets[0]) continue;
    const rest = prefix.slice(pattern.length - 1);
    return resolve(options.pathsBasePath ?? options.baseUrl ?? base, targets[0].replace("*", rest));
  }
  return undefined;
}

/** `[specifier, file]` for every module the entries name; entries that resolve to nothing are reported. */
function modules(ts, root, entries, config) {
  const found = [];
  const unresolved = [];
  for (const entry of entries) {
    if (entry.endsWith("*")) {
      const prefix = entry.slice(0, -1);
      const folder = wildcardFolder(prefix, root, config);
      if (!folder || !existsSync(folder)) {
        unresolved.push(entry);
        continue;
      }
      for (const name of readdirSync(folder).sort()) {
        if (!/\.tsx?$/.test(name) || /\.(?:d|test|spec|stories)\.tsx?$/.test(name)) continue;
        found.push([`${prefix}${name.replace(/\.tsx?$/, "")}`, join(folder, name)]);
      }
    } else {
      const file = ts.resolveModuleName(entry, join(root, "index.ts"), config.options, ts.sys).resolvedModule?.resolvedFileName;
      if (file && !file.endsWith(".d.ts")) found.push([entry, file]);
      else unresolved.push(entry);
    }
  }
  return { found, unresolved };
}

/** The module starts with the "use client" directive (before any other statement). */
function isUseClient(ts, sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) return false;
    if (statement.expression.text === "use client") return true;
  }
  return false;
}

function describeProp(ts, checker, prop, at) {
  const declarations = prop.declarations ?? [];
  if (declarations.length > 0 && declarations.every((d) => /node_modules[\\/]@types[\\/]react[\\/]/.test(d.getSourceFile().fileName))) return undefined;
  const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
  const type = checker.getTypeOfSymbolAtLocation(prop, at);
  const parts = type.isUnion() ? type.types.filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))) : [type];
  const literals = parts.filter((t) => t.isStringLiteral()).map((t) => t.value);
  if (literals.length > 0 && literals.length === parts.filter((t) => !(t.flags & ts.TypeFlags.BooleanLiteral)).length) {
    if (literals.length > MAX_LITERALS) return optional ? undefined : `${prop.getName()}: ${literals.slice(0, MAX_LITERALS).join("|")}|…`;
    return `${prop.getName()}${optional ? "?" : ""}: ${literals.join("|")}`;
  }
  const own = declarations.some((d) => !/node_modules/.test(d.getSourceFile().fileName));
  if (optional && !own) return undefined;
  const text = checker.typeToString(type).replace(/ \| undefined/g, "");
  return text.length > MAX_TYPE ? undefined : `${prop.getName()}${optional ? "?" : ""}: ${text}`;
}

/**
 * The "Project components" section: per module, its exported components (capitalized functions)
 * with their own props; a name UIify also has is left out, since screens must use UIify's.
 * @param {{ root: string; typescript: typeof import("typescript"); entries: readonly string[]; uiifyNames?: ReadonlySet<string> }} input
 * @returns {{ text: string; bytes: number; unresolved: string[] }}
 */
export function projectCatalog({ root, typescript: ts, entries, uiifyNames = new Set() }) {
  if (entries.length === 0) return { text: "", bytes: 0, unresolved: [] };
  const config = compilerOptions(ts, root);
  const { found, unresolved } = modules(ts, root, entries, config);
  const program = ts.createProgram(
    found.map(([, file]) => file),
    { ...config.options, noEmit: true },
  );
  const checker = program.getTypeChecker();
  const blocks = [];
  for (const [specifier, file] of found) {
    const sourceFile = program.getSourceFile(file);
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) continue;
    const lines = [];
    for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
      const name = symbol.getName();
      if (!/^[A-Z]/.test(name) || uiifyNames.has(name)) continue;
      const [signature] = checker.getTypeOfSymbolAtLocation(symbol, sourceFile).getCallSignatures();
      if (!signature) continue;
      const [param] = signature.getParameters();
      const props = param
        ? checker
            .getTypeOfSymbolAtLocation(param, sourceFile)
            .getProperties()
            .filter((prop) => !SKIP.test(prop.getName()))
            .map((prop) => describeProp(ts, checker, prop, sourceFile))
            .filter(Boolean)
        : [];
      lines.push(`- ${name}${props.length > 0 ? `: ${props.join("; ")}` : ""}`);
    }
    if (lines.length === 0) continue;
    const client = isUseClient(ts, sourceFile);
    blocks.push(`\`${specifier}\`${client ? ` ${CLIENT_NOTE}` : ""}\n${lines.join("\n")}`);
  }
  if (blocks.length === 0) return { text: "", bytes: 0, unresolved };
  const text = [
    "## Project components",
    'Screens may also import these project components (package.json "uiify.components"). A name UIify has is not listed: use UIify\'s.',
    ...blocks,
  ].join("\n");
  const withNewline = `${text}\n`;
  return { text: withNewline, bytes: Buffer.byteLength(withNewline), unresolved };
}

