/**
 * Build assertions for @gunkin/uiify/components.
 *
 * Mirrors packages/uiify/src/core/architecture.test.ts — adapted for components.
 *
 * Checks:
 *   (a) No banned layout reads (getBoundingClientRect, offsetWidth, etc.) in
 *       production source files (outside test-utils/).
 *   (b) Every component directory is classified in component-tiers.json.
 *   (c) Done components keep Tier 0 banned hooks out of server sources.
 *
 * The hook check applies only to components with status "done" so migration
 * stays incremental.
 *
 * dist/*.js "use client" banner checks against component-tiers.json status
 * live in apps/site/rsc-package-output.test.ts (the "published package client
 * boundary reachability" describe block), which walks every manifest-derived
 * server-compatible slug's built implementation tree — not this file.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { isServerComponent, loadTierManifest, type TierManifest } from "./tier-manifest.js";

// Resolve from this file, not process.cwd(): the root vitest.config.ts include
// (`packages/*/src/**/*.test.{ts,tsx}`) picks this suite up when vitest runs
// from the repo root, where every cwd-relative "src" read throws ENOENT and the
// whole architecture gate fails to collect. Matches tier-manifest.ts.
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = join(packageRoot, "src", "components");

// `enhance/` is the shared client enhancer, not a component: it has no tier,
// no server shell, and no fixture. See docs/guides/client-enhancement.md.
const NON_COMPONENT_DIRS = new Set(["test-utils", "enhance", "internal"]);

function tier0BannedHooks(manifest: TierManifest): readonly string[] {
  const tier = manifest.tiers["0"];
  expect(tier, 'component-tiers.json must define tiers["0"]').toBeDefined();
  return tier!.bannedHooks;
}

function componentDirectories(): string[] {
  return readdirSync(SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !NON_COMPONENT_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function doneComponents(manifest: TierManifest): string[] {
  return Object.entries(manifest.components)
    .filter(([, entry]) => entry.status === "done")
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
}

function assertNoBannedHooksInServerShell(name: string, bannedHooks: readonly string[]): void {
  const hookPattern = new RegExp(`\\b(${bannedHooks.join("|")})\\s*\\(`);
  const dir = join(SRC, name);
  if (!existsSync(dir)) {
    expect.fail(`done component "${name}" has no src/${name}/ directory`);
  }

  for (const file of readdirSync(dir)) {
    if (
      !/\.(ts|tsx)$/.test(file) ||
      file.includes(".test.") ||
      file === "client.tsx" ||
      file === "bridge.tsx"
    ) {
      continue;
    }
    // Hook modules imported only from client.tsx — not part of the Tier 0 server shell.
    if (file === "use-pagination.ts") {
      continue;
    }
    const path = join(dir, file);
    const source = readFileSync(path, "utf8");
    expect(source, path).not.toMatch(hookPattern);
  }
}

// Collect production source files (top-level only; component tasks add subfolders).
// Exclude test-utils, stories, and test files — those are not shipped.
function collectProductionFiles(): string[] {
  const files: string[] = [];

  // Top-level src files
  for (const file of readdirSync(SRC)) {
    if (
      /\.(ts|tsx)$/.test(file) &&
      !file.includes(".test.") &&
      !file.includes(".stories.") &&
      file !== "architecture.test.ts"
    ) {
      files.push(join(SRC, file));
    }
  }

  // Component subdirectories added by later tasks (skip test-utils/)
  for (const entry of readdirSync(SRC, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "test-utils") continue;
    const dir = join(SRC, entry.name);
    for (const file of readdirSync(dir)) {
      if (/\.(ts|tsx)$/.test(file) && !file.includes(".test.") && !file.includes(".stories.")) {
        files.push(join(dir, file));
      }
    }
  }

  return files;
}

const productionFiles = collectProductionFiles();
const manifest = loadTierManifest();

const bannedLayoutReadPattern =
  /\b(getBoundingClientRect|getClientRects|offsetWidth|offsetHeight|offsetLeft|offsetTop|clientWidth|clientHeight|scrollWidth|scrollHeight|innerText)\s*\(|getComputedStyle\s*\(/;

describe("package architecture", () => {
  it("contains no banned synchronous layout reads in production code", () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(bannedLayoutReadPattern);
    }
  });

  it("classifies every component directory in component-tiers.json", () => {
    const dirs = componentDirectories();
    const manifestNames = new Set(Object.keys(manifest.components));

    for (const name of dirs) {
      expect(manifestNames.has(name), `src/${name}/ is missing from component-tiers.json`).toBe(
        true,
      );
    }

    for (const name of dirs) {
      expect(manifest.components[name], `src/${name}/ manifest entry`).toBeDefined();
    }
  });

  // The old bundled-output banner and cross-bundle-isolation assertions were
  // retired with the unbundled dist: each module now emits from its
  // own source file, so bundling could not leak content between components
  // and a shared bundle banner no longer exists. See
  // packages/uiify/src/package-output.test.ts for the current source of truth
  // on per-module directives and dist output shape.

  it("does not import cloneElement or JavaScript-based positioning libraries", () => {
    if (productionFiles.length === 0) return;
    const source = productionFiles.map((f) => readFileSync(f, "utf8")).join("\n");
    expect(source).not.toMatch(/cloneElement|@floating-ui|@popperjs/);
  });

  it("does not subscribe to context purely to assert a parent in done components", () => {
    // A `useXContext(...)` call standing alone as a complete statement means
    // the value is discarded — the subscription exists only to throw when a
    // part is used outside its Root. That buys an error message at the cost
    // of a client boundary, which is what forces otherwise-RSC-pure parts
    // into the client bundle. Real consumers bind the result:
    //   const { store } = useXContext("Part");
    // — including the formatted form where the call lands alone on its own
    // line but the line before it ends in `=`. That form must not be flagged.
    const bareCall = /^use[A-Z]\w*Context\(.*\);$/;

    const doneComponentDirs = new Set(doneComponents(manifest).map((name) => join(SRC, name)));

    for (const file of productionFiles) {
      // Pending components have not completed the RSC boundary migration yet.
      if (!doneComponentDirs.has(dirname(file))) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      let previousNonBlank = "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === "") continue;
        if (bareCall.test(trimmed) && !previousNonBlank.endsWith("=")) {
          expect.fail(`${file}: "${trimmed}" discards a context subscription`);
        }
        previousNonBlank = trimmed;
      }
    }
  });

  it("does not reintroduce the old createContext + 'must be used within' throw pattern", () => {
    // Every remaining compound component uses the shared
    // `createContext<T | null>(null)` + local `useXContext` throw to the
    // shared `createPartContext` helper. `internal/` is exempt: it's where
    // createPartContext itself and other shared primitives live, not a
    // public compound with parts to guard.
    // Matches both `createContext(...)` and the generic-typed
    // `createContext<T | null>(...)` form — a plain `.includes("createContext(")`
    // misses the latter because the type parameter sits between the name and
    // the paren, which is exactly the form every one of these files used.
    const createContextPattern = /createContext\s*(<[^(]*>)?\s*\(/;
    const internalDir = join(SRC, "internal");
    for (const file of productionFiles) {
      if (file === join(internalDir, "") || file.startsWith(`${internalDir}/`)) continue;
      const source = readFileSync(file, "utf8");
      if (createContextPattern.test(source) && source.includes("must be used within")) {
        expect.fail(
          `${file}: still hand-rolls createContext + "must be used within"; use createPartContext`,
        );
      }
    }
  });

  it("Tier 0 server components keep banned hooks out of server sources", () => {
    const bannedHooks = tier0BannedHooks(manifest);

    for (const name of doneComponents(manifest).filter((componentName) =>
      isServerComponent(componentName, manifest),
    )) {
      assertNoBannedHooksInServerShell(name, bannedHooks);
    }
  });
});
