import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const packageDirectory = resolve(import.meta.dirname, "..");

function readPackageManifest(): {
  readonly name?: string;
  readonly version?: string;
  readonly description?: string;
  readonly license?: string;
  readonly repository?: { readonly type?: string; readonly url?: string };
  readonly homepage?: string;
  readonly bugs?: { readonly url?: string };
  readonly keywords?: readonly string[];
  readonly files?: readonly string[];
  readonly publishConfig?: { readonly access?: string; readonly tag?: string };
  readonly scripts?: Record<string, string>;
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

test("declares public alpha release metadata", () => {
  const manifest = readPackageManifest();
  expect(manifest).toMatchObject({
    name: "@gunkin/uiify",
    version: expect.stringMatching(/^\d+\.\d+\.\d+-alpha(?:\.\d+)?$/),
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/antongunkin/uiify.git",
    },
    homepage: "https://uiify.gunkin.dev/",
    bugs: { url: "https://github.com/antongunkin/uiify/issues" },
    files: ["dist"],
    publishConfig: { access: "public", tag: "alpha" },
  });
  expect(manifest.description).toBeTruthy();
  expect(manifest.keywords).toContain("react");
});

test("owns all standalone release commands", () => {
  expect(readPackageManifest().scripts).toMatchObject({
    build: "tsup",
    test: "vitest run",
    typecheck: "tsc --noEmit",
    "check:package": expect.stringContaining("attw --pack ."),
    "check:layout-reads": "node scripts/check-banned-layout-reads.mjs",
    "verify:tarball": "node scripts/verify-tarball.mjs",
    "release:check": expect.any(String),
  });
});

test("excludes CSS-only exports from attw resolution", () => {
  const checkPackage = readPackageManifest().scripts?.["check:package"] ?? "";

  for (const entrypoint of [
    "./components/behavior.css",
    "./elements/behavior.css",
    "./styles",
    "./styles/index.css",
    "./styles.css",
    "./styles/tokens",
    "./styles/tokens.css",
    "./styles/tailwind",
    "./styles/tailwind.css",
    "./styles/reset",
    "./styles/reset.css",
  ]) {
    expect(checkPackage).toContain(entrypoint);
  }
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
