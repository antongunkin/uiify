import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const packageDirectory = resolve(import.meta.dirname, "..");

function readPackageManifest(): {
  readonly name?: string;
  readonly exports?: Record<string, unknown>;
} {
  const manifestPath = resolve(packageDirectory, "package.json");
  if (!existsSync(manifestPath)) return {};
  return JSON.parse(readFileSync(manifestPath, "utf8")) as ReturnType<typeof readPackageManifest>;
}

test("defines the uiify package and its initial public subpaths", () => {
  const manifest = readPackageManifest();
  expect(manifest.name).toBe("@gunkin/uiify");
  expect(manifest.exports).toMatchObject({
    "./hooks": expect.anything(),
    "./core": expect.anything(),
    ".": expect.anything(),
    "./components/*": expect.anything(),
    "./components/behavior.css": expect.anything(),
    "./elements": expect.anything(),
    "./elements/*": expect.anything(),
    "./styles": expect.anything(),
  });
});

test("emits built Carousel base and explicit adapter entry points", () => {
  for (const entry of ["carousel", "carousel/client", "carousel/fade"]) {
    const output = resolve(packageDirectory, `dist/components/${entry}.js`);
    expect(existsSync(output)).toBe(true);
    expect(existsSync(output.replace(/\.js$/, ".d.ts"))).toBe(true);
  }
});

test("keeps the Carousel base graph independent of client and fade behavior", () => {
  const visited = visitRelativeGraph(resolve(packageDirectory, "dist/components/carousel.js"));
  expect(visited.size).toBeGreaterThan(3);
  for (const path of visited) {
    expect(readFileSync(path, "utf8"), path).not.toMatch(/^\s*["']use client["']/);
    expect(path).not.toMatch(/\/carousel\/(?:client|fade)\//);
  }
  for (const entry of [
    "src/index.ts",
    "src/components/index.ts",
    "src/components/carousel/index.ts",
  ]) {
    const source = readFileSync(resolve(packageDirectory, entry), "utf8");
    expect(source).not.toMatch(/CarouselClient|FadeCarouselClient|carousel\/(?:client|fade)/);
  }
});

function visitRelativeGraph(entry: string): Set<string> {
  const visited = new Set<string>();
  function visit(path: string): void {
    if (visited.has(path)) return;
    visited.add(path);
    const source = readFileSync(path, "utf8");
    for (const match of source.matchAll(/(?:from\s*|import\s*)["'](\.\.?\/[^"']+)["']/g)) {
      visit(resolve(path, "..", match[1]!));
    }
  }
  visit(entry);
  return visited;
}

test("keeps ContextMenu independent of the DropdownMenu implementation", () => {
  const visited = visitRelativeGraph(resolve(packageDirectory, "dist/components/context-menu.js"));
  expect([...visited].filter((path) => path.includes("/components/dropdown-menu/"))).toEqual([]);
});
