/**
 * Build assertions for @gunkin/uiify/elements — the native-mechanism layer.
 * These tests enforce the native-mechanism layer contract.
 *
 * Checks:
 *   (a) No Tier 0 banned hook in production source (same list Tier 0
 *       components are held to, read from component-tiers.json).
 *   (b) No "use client" directive.
 *   (c) No import from ../components/ or @gunkin/uiify/hooks — elements may only
 *       import from @gunkin/uiify/core/render and react types.
 *   (d) No banned synchronous layout reads.
 *   (e) Every element-manifest.json key has a matching src/elements/<name>/
 *       directory, and vice versa.
 *   (f) No @gunkin/uiify/components module shares a name with a @gunkin/uiify/elements
 *       module — the public subpaths must remain unambiguous.
 *       dialog/popover/alert-dialog components were renamed to
 *       modal/popup/alert-modal in T0).
 *
 * Fixture- and docs-registry cross-checks (every element has a fixture slug
 * and a docs page, and vice versa) land in T7/T9 once those registries exist;
 * this file cannot assert against infrastructure that isn't built yet.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { loadTierManifest } from "../components/tier-manifest.js";

// Resolve from this file, not process.cwd() — matches components/architecture.test.ts
// and core/architecture.test.ts so this suite collects correctly whether vitest runs
// from the repo root or the package directory.
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = join(packageRoot, "src", "elements");
const COMPONENTS_SRC = join(packageRoot, "src", "components");

const NON_ELEMENT_FILES = new Set(["index.ts", "element-manifest.json", "architecture.test.ts"]);
// test-utils/ holds test-only helpers (e.g. the SSR renderer), not a shipped
// element — matches components/architecture.test.ts's NON_COMPONENT_DIRS.
const NON_ELEMENT_DIRS = new Set(["test-utils"]);

interface ElementManifest {
  readonly $comment?: string;
  readonly elements: Readonly<Record<string, unknown>>;
}

function loadElementManifest(): ElementManifest {
  const manifestPath = join(SRC, "element-manifest.json");
  return JSON.parse(readFileSync(manifestPath, "utf8")) as ElementManifest;
}

function elementDirectories(): string[] {
  return readdirSync(SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !NON_ELEMENT_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

// Collect production source files: top-level (index.ts is exempt — it is a
// pure re-export barrel with no logic of its own) plus every file inside an
// element subdirectory, excluding tests and test-utils/.
function collectProductionFiles(): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(SRC, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (NON_ELEMENT_DIRS.has(entry.name)) continue;
      const dir = join(SRC, entry.name);
      for (const file of readdirSync(dir)) {
        if (/\.(ts|tsx)$/.test(file) && !file.includes(".test.") && !file.includes(".stories.")) {
          files.push(join(dir, file));
        }
      }
      continue;
    }
    if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !entry.name.includes(".test.") &&
      !NON_ELEMENT_FILES.has(entry.name)
    ) {
      files.push(join(SRC, entry.name));
    }
  }

  return files;
}

const productionFiles = collectProductionFiles();
const tierManifest = loadTierManifest();

const bannedLayoutReadPattern =
  /\b(getBoundingClientRect|getClientRects|offsetWidth|offsetHeight|offsetLeft|offsetTop|clientWidth|clientHeight|scrollWidth|scrollHeight|innerText)\s*\(|getComputedStyle\s*\(/;

describe("@gunkin/uiify/elements architecture", () => {
  it("contains no banned synchronous layout reads", () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(bannedLayoutReadPattern);
    }
  });

  it("never ships a Tier 0 banned React hook", () => {
    const bannedHooks = tierManifest.tiers["0"]?.bannedHooks;
    expect(bannedHooks, 'component-tiers.json must define tiers["0"].bannedHooks').toBeDefined();
    const hookPattern = new RegExp(`\\b(${bannedHooks!.join("|")})\\s*\\(`);
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(hookPattern);
    }
  });

  it('never carries a "use client" directive', () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/^\s*["']use client["'];?/);
    }
  });

  it("only imports @gunkin/uiify/core/render and react — never components or hooks", () => {
    const forbiddenImportPattern = /from\s+["'](\.\.\/components\/|@gunkin\/uiify\/hooks)/;
    const allowedSpecifierPattern = /^(react|@gunkin\/uiify\/core\/render|\.|\.\.\/types)/;
    const importPattern = /from\s+["']([^"']+)["']/g;

    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(forbiddenImportPattern);

      for (const match of source.matchAll(importPattern)) {
        const specifier = match[1]!;
        // Relative imports within an element's own directory (./types.js,
        // ./ids.js, …) and react/core/render are the only allowed sources.
        if (specifier.startsWith(".")) continue;
        expect(
          allowedSpecifierPattern.test(specifier),
          `${file}: unexpected import "${specifier}" — elements may only import react and @gunkin/uiify/core/render`,
        ).toBe(true);
      }
    }
  });

  it("keeps element-manifest.json and src/elements/<name>/ directories in sync", () => {
    const manifest = loadElementManifest();
    const manifestNames = new Set(Object.keys(manifest.elements));
    const dirs = elementDirectories();

    for (const name of dirs) {
      expect(
        manifestNames.has(name),
        `src/elements/${name}/ is missing from element-manifest.json`,
      ).toBe(true);
    }
    for (const name of manifestNames) {
      expect(
        existsSync(join(SRC, name)),
        `element-manifest.json declares "${name}" but src/elements/${name}/ does not exist`,
      ).toBe(true);
    }
  });

  it("never lets a @gunkin/uiify/components module share a name with a @gunkin/uiify/elements module", () => {
    // The collision is in the types (both layers would want e.g. DialogContentProps with different
    // shapes), not the values — so the rule is enforced on directory names,
    // which is what determines the subpath and therefore the type names.
    const elementNames = new Set(Object.keys(loadElementManifest().elements));
    const componentDirs = readdirSync(COMPONENTS_SRC, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const name of componentDirs) {
      expect(
        elementNames.has(name),
        `@gunkin/uiify/components/${name} shares its name with @gunkin/uiify/elements/${name} — rename one`,
      ).toBe(false);
    }
  });
});
