import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const sourceDirectory = import.meta.dirname;

function sourceFiles(directory = sourceDirectory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

function violations(files: string[], pattern: RegExp): string[] {
  return files.filter((path) => pattern.test(readFileSync(path, "utf8")));
}

test("value callbacks are named onValueChange, not onChange", () => {
  const typeFiles = sourceFiles().filter((path) => path.endsWith("types.ts"));
  // A Root-level `onChange` that receives a value (not an event) breaks the vocabulary.
  expect(violations(typeFiles, /readonly onChange\?: \((?!event\b)/)).toEqual([]);
});

test("sizes use sm | md | lg", () => {
  const typeFiles = sourceFiles().filter((path) => path.endsWith("types.ts"));
  expect(violations(typeFiles, /Size\s*=\s*[^;]*"(?:small|large|default)"/)).toEqual([]);
  const styles = sourceFiles().filter((path) => path.endsWith(".css"));
  expect(violations(styles, /data-size="(?:small|large|default)"/)).toEqual([]);
});

test("open state is data-state, not data-open", () => {
  const implementation = sourceFiles().filter(
    (path) => /\.(?:tsx?|css)$/.test(path) && !path.endsWith("naming.test.ts"),
  );
  expect(violations(implementation, /data-open\b/)).toEqual([]);
});
