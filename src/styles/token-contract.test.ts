import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const packageRoot = resolve(import.meta.dirname, "../..");
const repositoryRoot = existsSync(resolve(packageRoot, "../../apps/site/src/docs"))
  ? resolve(packageRoot, "../..")
  : packageRoot;
const themeSource = readFileSync(resolve(packageRoot, "src/styles/tokens/theme.css"), "utf8");

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
  resolve(packageRoot, "src/styles"),
  resolve(repositoryRoot, "packages/test-fixtures/src"),
  resolve(repositoryRoot, "apps/site/src/docs"),
].filter(existsSync);

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
      expect(themeSource).toMatch(new RegExp(`--${token}\\s*:`));
    }
  });

  test("does not ship the legacy semantic vocabulary", () => {
    const source = sourceForStyleRoots();
    for (const token of legacySemanticTokens) {
      expect(hasCssVariable(source, token)).toBe(false);
    }
  });

  test("keeps raw primitive families available", () => {
    for (const token of [
      "--gray-0",
      "--blue-6",
      "--red-7",
      "--space-md",
      "--radius-1",
      "--font-sans",
      "--shadow-1",
    ]) {
      expect(themeSource).toContain(`${token}:`);
    }
  });
});
