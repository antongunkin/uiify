// The ai layer depends on the library as a consumer would: every runtime import that leaves
// src/ai/ targets a public component entry (`components/<name>/index.js`, served as
// `@gunkin/uiify/components/<name>`). Type-only imports may also name a public core entry.
// The other half of the boundary (nothing outside src/ai/ imports ai) is in core/architecture.test.ts.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadTierManifest } from "../components/tier-manifest.js";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AI = join(SRC, "ai");
const publicComponents = new Set(Object.keys(loadTierManifest().components));
const importPattern =
  /\b(import\s+type\b|export\s+type\b)?[^"';]*?\bfrom\s*["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/g;

function productionFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "test-utils" ? [] : productionFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name) ? [path] : [];
  });
}

function offenders(): string[] {
  return productionFiles(AI).flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(importPattern)].flatMap((match) => {
      const typeOnly = Boolean(match[1]);
      const specifier = match[2] ?? match[3]!;
      if (!specifier.startsWith(".")) return [];
      const target = relative(SRC, resolve(dirname(file), specifier));
      if (!target.startsWith("..") && target.startsWith("ai/")) return [];
      const component = /^components\/([^/]+)\/index\.js$/.exec(target)?.[1];
      if (component && publicComponents.has(component)) return [];
      if (typeOnly && /^core\/[^/]+(\/index)?\.js$/.test(target)) return [];
      return [`${relative(SRC, file)}: ${specifier}${typeOnly ? " (type)" : ""}`];
    }),
  );
}

describe("ai package boundary", () => {
  it("imports components only through their public entries", () => {
    expect(productionFiles(AI).length).toBeGreaterThan(5);
    expect(offenders()).toEqual([]);
  });
});
