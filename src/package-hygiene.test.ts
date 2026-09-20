import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const packageDirectory = resolve(import.meta.dirname, "..");
const forbidden = [
  /docs\/(?:plans|superpowers)\//i,
  /\b(?:Task|Step)\s+\d+/,
  /\bAppendix\s+[A-Z]\b/,
  /Co-authored-by:/i,
  /noreply@(?:anthropic|openai)\.com/i,
  /\.\.\/\.\.\/docs\//,
];

function packageFiles(directory = packageDirectory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (
      ["dist", "node_modules", "package-hygiene.test.ts"].includes(entry.name) ||
      entry.name === "package-lock.json"
    ) {
      return [];
    }
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? packageFiles(path) : statSync(path).isFile() ? [path] : [];
  });
}

test("contains no internal workflow commentary or monorepo-only links", () => {
  const violations = packageFiles().flatMap((path) => {
    const text = readFileSync(path, "utf8");
    return forbidden
      .filter((pattern) => pattern.test(text))
      .map((pattern) => ({ path, pattern: pattern.toString() }));
  });
  expect(violations).toEqual([]);
});

test("keeps standalone workflows on release checks and npm OIDC", () => {
  const workflowDirectory = resolve(packageDirectory, ".github/workflows");
  const ci = readFileSync(resolve(workflowDirectory, "ci.yml"), "utf8");
  const publish = readFileSync(resolve(workflowDirectory, "publish-alpha.yml"), "utf8");
  expect(ci).toContain("npm run release:check");
  expect(publish).toContain("workflow_dispatch");
  expect(publish).toContain("id-token: write");
  expect(publish).toContain("npm publish --access public --tag alpha");
  expect(publish).not.toContain("NPM_TOKEN");
});
