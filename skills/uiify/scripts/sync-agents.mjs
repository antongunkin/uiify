import { existsSync, realpathSync } from "node:fs";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import {
  classifySection,
  composeSection,
  markedSection,
  refreshSkill,
  sectionBody,
  skillState,
  upsertSection,
} from "./agents-section.mjs";
import { loadTypeScript, PROJECT_CATALOG_BYTE_LIMIT, projectCatalog, projectComponents } from "./project-catalog.mjs";

const USAGE = "usage: sync-agents.mjs [--check | --write [--install]] [--force] [file ...]";
const SKILL_DIRS = [".claude/skills/uiify", ".agents/skills/uiify"];
/** Short rules for agents that load `.claude/rules/*.md` but do not expand `@AGENTS.md` imports. */
const CLAUDE_RULES = ".claude/rules/uiify.md";

async function readOrEmpty(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

/** The installed package, found from the project so hoisted monorepo installs work. */
function installedPackage(root) {
  let manifest;
  try {
    manifest = createRequire(join(root, "package.json")).resolve("@gunkin/uiify/package.json");
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" || error.code === "ERR_PACKAGE_PATH_NOT_EXPORTED")
      throw new Error("@gunkin/uiify is not installed in this project; run npm install @gunkin/uiify.");
    throw error;
  }
  return { directory: dirname(manifest), manifest };
}

/**
 * Bring the project's AGENTS.md (and CLAUDE.md) section, `.claude/rules/uiify.md` and skill copies in step with
 * the installed package. `install` also copies the skill where it is absent. Returns the exit code:
 * 0 in step, 1 needs attention (outdated on --check, an edited section kept), 2 an error (printed to stderr).
 * @param {{ root?: string, write?: boolean, force?: boolean, install?: boolean, files?: string[] }} [options]
 * @returns {Promise<number>}
 */
export async function syncAgents(options = {}) {
  try {
    return await sync(options);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

async function sync({ root = process.cwd(), write = false, force = false, install = false, files = [] }) {
  const { directory, manifest } = installedPackage(root);
  const version = JSON.parse(await readFile(manifest, "utf8")).version;
  const installedSkill = join(directory, "skills", "uiify");
  const rules = await readFile(join(installedSkill, "references", "agents-rules.md"), "utf8");
  const catalog = await readFile(join(directory, "agents", "catalog.md"), "utf8");
  // The project's own components screens may use (package.json `uiify.components`), from their types.
  let listed = catalog;
  const entries = projectComponents(root);
  if (entries.length > 0) {
    const namesPath = join(directory, "agents", "names.json");
    const uiifyNames = existsSync(namesPath) ? new Set(JSON.parse(await readFile(namesPath, "utf8"))) : new Set();
    const project = projectCatalog({ root, typescript: loadTypeScript(root), entries, uiifyNames });
    for (const entry of project.unresolved) console.log(`project components: "${entry}" resolves to no file`);
    if (project.bytes > PROJECT_CATALOG_BYTE_LIMIT) {
      console.log(`project components: ${project.bytes} bytes, over ${PROJECT_CATALOG_BYTE_LIMIT}; list fewer modules in package.json "uiify.components"`);
    }
    if (project.text) listed = `${catalog.trimEnd()}\n\n${project.text}`;
  }
  const section = composeSection(version, rules, listed);
  const body = sectionBody(rules, listed);

  let failed = false;
  let upgraded = false;
  /** Bring the marked section of one file to `body`, reporting its state. */
  async function syncFile(name, body, section) {
    const path = join(root, name);
    const text = await readOrEmpty(path);
    const { state, fromVersion } = classifySection(text, version, body);
    if (!write) {
      const detail = state === "outdated" ? ` ${fromVersion} → ${version}` : state === "edited" ? ` (${fromVersion})` : "";
      console.log(`${name}: ${state}${detail}`);
      if (state !== "current") failed = true;
      return;
    }
    if (state === "current") {
      console.log(`${name}: current`);
    } else if (state === "edited" && !force) {
      console.log(`${name}: edited, kept; review it, then run again with --force to replace it`);
      failed = true;
    } else {
      await writeFile(path, upsertSection(text, section));
      if (state === "missing") console.log(`${name}: added`);
      else console.log(`${name}: ${state === "edited" ? "replaced edited section" : `updated ${fromVersion} → ${version}`}`);
      if (state !== "missing") upgraded = true;
    }
  }

  const targets = files.length > 0 ? files : ["AGENTS.md"];
  if (files.length === 0 && existsSync(join(root, "CLAUDE.md"))) {
    const claude = await readFile(join(root, "CLAUDE.md"), "utf8");
    // Claude Code loads AGENTS.md through an `@AGENTS.md` line; a second section would load twice.
    if (!/^@(?:\.\/)?AGENTS\.md[ \t]*\r?$/m.test(claude)) targets.push("CLAUDE.md");
    else if (classifySection(claude, version, body).state === "missing") console.log("CLAUDE.md: imports AGENTS.md");
    else {
      console.log("CLAUDE.md: imports AGENTS.md and has its own section; delete that section");
      failed = true;
    }
  }
  for (const name of targets) await syncFile(name, body, section);
  if (files.length === 0) {
    const path = join(root, CLAUDE_RULES);
    if ((await lstat(path).catch(() => null))?.isSymbolicLink()) {
      console.log(`${CLAUDE_RULES}: linked, not written`);
    } else {
      const skillPath = relative(root, installedSkill).split(sep).join("/");
      const template = await readFile(join(installedSkill, "references", "claude-rules.md"), "utf8");
      const rulesBody = template.trimEnd().replaceAll("{skill}", skillPath);
      if (write) await mkdir(dirname(path), { recursive: true });
      await syncFile(CLAUDE_RULES, rulesBody, markedSection(version, rulesBody));
    }
  }

  const found = [];
  for (const dir of SKILL_DIRS) {
    let state = await skillState(join(root, dir), installedSkill);
    if (state === "absent") {
      if (!(write && install)) continue;
      await refreshSkill(join(root, dir), installedSkill);
      found.push({ dir, state: "added" });
      continue;
    }
    if (write && state === "outdated") {
      await refreshSkill(join(root, dir), installedSkill);
      state = "refreshed";
      upgraded = true;
    }
    found.push({ dir, state });
  }
  if (found.length === 0) console.log("skill: not installed; run npx @gunkin/uiify init");
  for (const { dir, state } of found) {
    console.log(`${found.length === 1 ? "skill" : `skill ${dir}`}: ${state}`);
    if (!write && state === "outdated") failed = true;
  }

  if (write && upgraded) {
    console.log("Run `node .agents/skills/uiify/scripts/check-screens.mjs <dir>` (it runs `tsc` too) and fix what it reports.");
  }
  return failed ? 1 : 0;
}

/** Command-line options, or null when they do not parse. */
function parseArgs(args) {
  const options = { write: false, force: false, install: false, files: [] };
  let check = false;
  for (const arg of args) {
    if (arg === "--write") options.write = true;
    else if (arg === "--check") check = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--install") options.install = true;
    else if (arg.startsWith("--")) return null;
    else options.files.push(arg);
  }
  if ((options.write && check) || (options.install && !options.write)) return null;
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const options = parseArgs(process.argv.slice(2));
  if (options === null) {
    console.error(USAGE);
    process.exitCode = 2;
  } else {
    process.exitCode = await syncAgents(options);
  }
}
