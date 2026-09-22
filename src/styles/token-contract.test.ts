import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const currentDirectory = resolve(process.cwd());
const repositoryRoot = existsSync(
  resolve(currentDirectory, "packages/uiify/src/styles/tokens/semantic.css"),
)
  ? currentDirectory
  : resolve(currentDirectory, "../..");
const semanticSource = readFileSync(
  resolve(repositoryRoot, "packages/uiify/src/styles/tokens/semantic.css"),
  "utf8",
);
const primitiveSource = readFileSync(
  resolve(repositoryRoot, "packages/uiify/src/styles/tokens/primitives.css"),
  "utf8",
);

const canonicalSemanticTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

const foregroundPairs = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
] as const;

const legacySemanticTokens = [
  "--color-bg",
  "--color-fg",
  "--color-surface",
  "--color-surface-raised",
  "--color-surface-muted",
  "--color-muted-fg",
  "--color-border-strong",
  "--color-accent-fg",
  "--color-accent-hover",
  "--color-accent-active",
  "--color-accent-subtle",
  "--color-danger",
  "--color-danger-fg",
  "--color-danger-hover",
  "--color-ring-shadow",
] as const;

function hasCssVariable(source: string, name: string): boolean {
  return new RegExp(`${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}(?![\\w-])`).test(source);
}

const styleRoots = [
  resolve(repositoryRoot, "packages/uiify/src/styles"),
  resolve(repositoryRoot, "packages/test-fixtures/src"),
  resolve(repositoryRoot, "apps/site/src/docs"),
  resolve(repositoryRoot, "apps/shadcn-smoke/app"),
];

function cssFiles(path: string): string[] {
  if (statSync(path).isFile()) return path.endsWith(".css") ? [path] : [];

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    cssFiles(resolve(path, entry.name)),
  );
}

function sourceForStyleRoots(): string {
  return styleRoots
    .flatMap(cssFiles)
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
}

describe("canonical semantic token contract", () => {
  test("defines every canonical semantic token in the package source", () => {
    for (const token of canonicalSemanticTokens) {
      expect(semanticSource).toMatch(new RegExp(`--${token}\\s*:`));
    }
  });

  test("defines every foreground role as a complete pair", () => {
    for (const [surface, foreground] of foregroundPairs) {
      expect(canonicalSemanticTokens).toContain(surface);
      expect(canonicalSemanticTokens).toContain(foreground);
    }
  });

  test("does not ship the legacy semantic vocabulary", () => {
    const source = sourceForStyleRoots();
    for (const token of legacySemanticTokens) {
      expect(hasCssVariable(source, token)).toBe(false);
    }
  });

  test("defines every canonical token used by package styles", () => {
    const source = sourceForStyleRoots();
    for (const token of canonicalSemanticTokens) {
      if (source.includes(`var(--${token}`)) {
        expect(semanticSource).toMatch(new RegExp(`--${token}\\s*:`));
      }
    }
  });

  test("keeps raw primitive families available", () => {
    for (const token of [
      "--gray-0",
      "--blue-6",
      "--red-7",
      "--size-1",
      "--radius-1",
      "--font-sans",
      "--shadow-1",
    ]) {
      expect(primitiveSource).toContain(`${token}:`);
    }
  });

  test("allows private component hooks outside the semantic vocabulary", () => {
    expect(sourceForStyleRoots()).toMatch(/--uiify-[a-z0-9-]+\s*:/);
  });
});
