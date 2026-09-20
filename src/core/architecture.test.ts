import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Resolve from this file, not process.cwd(): the root vitest.config.ts include
// (`packages/*/src/**/*.test.{ts,tsx}`) picks this suite up when vitest runs
// from the repo root, where cwd-relative "src"/"dist" reads throw ENOENT and the
// whole architecture gate fails to collect instead of asserting anything.
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = join(packageRoot, "src");
const CORE_SRC = join(SRC, "core");
const DIST = join(packageRoot, "dist");

// This suite's scope is src/core/** only — src/components/** has its own
// components/architecture.test.ts (note: that file has at least one similar
// wrong-dist-path bug of its own — join(DIST, "separator.js") instead of
// join(DIST, "components", "separator.js") — tracked separately, not fixed
// here). Walk recursively: core/ has grown subdirectories since this file
// was first written, and a top-level-only readdirSync silently stops seeing
// anything nested.
function collectProductionFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectProductionFiles(path));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
      files.push(path);
    }
  }
  return files;
}

const productionFiles = collectProductionFiles(CORE_SRC);

const bannedLayoutReadPattern =
  /\b(getBoundingClientRect|getClientRects|offsetWidth|offsetHeight|offsetLeft|offsetTop|clientWidth|clientHeight|scrollWidth|scrollHeight|innerText)\s*\(|getComputedStyle\s*\(/;

// Heuristic for a reintroduced, renamed universal props merger: a function
// that iterates arbitrary prop keys taken from two prop-like objects and
// special-cases className / style / on* event handlers — the exact shape
// mergeProps had before its removal. This is a review signal, not
// proof of absence: it looks for the combination of an arbitrary-key
// iteration construct plus all three special cases anywhere in the same
// file, and a sufficiently different reimplementation (recursion, a lookup
// table, the special-casing split across helper functions, differently
// spelled key checks) will not trip it. docs/CONTRIBUTING-clean-room.md
// makes explicit that a human reviewer remains the real gate for a
// well-disguised reimplementation.
const iteratesArbitraryKeys =
  /\bfor\s*\(\s*(?:const|let)\s+\w+\s+in\s+\w+\s*\)|Object\.(?:keys|entries|getOwnPropertyNames)\(/;
const specialCasesClassName = /\bclassName\b/;
const specialCasesStyle = /\bstyle\b/;
const specialCasesEventHandlers = /\bon[A-Z]\w*\b|\.startsWith\(\s*["']on["']\s*\)|\/\^on\//;

describe("package architecture", () => {
  it("contains no cloned-child or JavaScript positioning implementation", () => {
    const source = productionFiles.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(source).not.toMatch(/cloneElement|@floating-ui|@popperjs/);
  });

  it("contains no banned synchronous layout reads in production code", () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(bannedLayoutReadPattern);
    }
  });

  it("emits client directives only for interactive public entries", () => {
    // core/dialog.js is a plain re-export barrel (`export { useDialog } from
    // "./use-dialog.js"`) with no own executable statement, so per the
    // audit it stays neutral and carries no directive of its own — the
    // directive lives on the real implementation module it wraps. The root
    // entry (src/index.ts) is a
    // neutral barrel too, and consumers reach client components through the
    // implementation modules underneath.
    if (!existsSync(join(DIST, "core", "use-dialog.js"))) return;
    expect(readFileSync(join(DIST, "core", "use-dialog.js"), "utf8")).toMatch(/^"use client";/);
    expect(readFileSync(join(DIST, "index.js"), "utf8")).not.toMatch(/^"use client";/);
  });

  it("contains no merge-props source file under src/core/", () => {
    const offenders = productionFiles.filter((file) => /merge-?props/i.test(file));
    expect(offenders).toEqual([]);
  });

  it("does not export mergeProps (or a similarly-named export) from core/index.ts", () => {
    const source = readFileSync(join(CORE_SRC, "index.ts"), "utf8");
    expect(source).not.toMatch(/\bmergeProps\b/i);
  });

  it("does not ship dist/core/merge-props.js after a build", () => {
    if (!existsSync(DIST)) return;
    expect(existsSync(join(DIST, "core", "merge-props.js"))).toBe(false);
  });

  // See the comment above iteratesArbitraryKeys/etc. — this is a heuristic
  // signal, not proof. Do not treat a pass here as clearance for a
  // reimplementation that a human reviewer would otherwise flag.
  it("contains no reintroduced universal props merger (heuristic, not proof)", () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      const looksLikeUniversalMerger =
        iteratesArbitraryKeys.test(source) &&
        specialCasesClassName.test(source) &&
        specialCasesStyle.test(source) &&
        specialCasesEventHandlers.test(source);
      expect(looksLikeUniversalMerger, file).toBe(false);
    }
  });
});
