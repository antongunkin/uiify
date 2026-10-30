import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import { PART_NAMES } from "./core/part-names.js";

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

test("label interfaces use the labels prop without competing label bags", () => {
  const typeFiles = sourceFiles().filter(
    (path) => path.includes("/components/") && path.endsWith("types.ts"),
  );
  const labelsInterfaces = typeFiles.flatMap((path) => {
    const source = readFileSync(path, "utf8");
    return [...source.matchAll(/export interface (\w+Labels)\s*\{/g)].map((match) => ({
      path,
      source,
      name: match[1]!,
    }));
  });

  expect(labelsInterfaces.length).toBeGreaterThan(0);
  for (const { path, source, name } of labelsInterfaces) {
    expect(source, path).toMatch(new RegExp(`readonly labels\\?: Partial<${name}>`));
  }

  const competitors = typeFiles.flatMap((path) => {
    const source = readFileSync(path, "utf8");
    return [...source.matchAll(/readonly (\w*[lL]abels?)\?:\s*Partial</g)]
      .filter((match) => match[1] !== "labels")
      .map((match) => `${path}: ${match[1]}`);
  });
  expect(competitors).toEqual([]);
});

const implementationFiles = () =>
  sourceFiles().filter((path) => /\.(?:tsx?|css)$/.test(path) && !path.includes(".test."));

test("data-part values come from the part vocabulary", () => {
  const known = new Set<string>(PART_NAMES);
  const unknown = implementationFiles().flatMap((path) =>
    [...readFileSync(path, "utf8").matchAll(/data-part"?\s*[:=]\s*"([a-z]+(?:-[a-z]+)*)"/g)]
      .map((match) => match[1]!)
      .filter((name) => !known.has(name))
      .map((name) => `${path}: ${name}`),
  );
  expect(unknown).toEqual([]);
});

// Sub-identities that name a part family rather than a folder. Extend only with a reason.
const IDENTITY_SUBNAMES = new Set([
  "alert-description",
  "alert-title",
  "description-details",
  "description-term",
  "empty-content",
  "empty-description",
  "empty-title",
  "fieldset-legend",
  "item-actions",
  "item-content",
  "item-media",
  "item-metadata",
  "menu",
  "menu-bar",
  "radio",
  "slider-client",
  "surface",
  "toc-value",
]);

test("identity markers use full component or element names", () => {
  const folders = new Set(
    ["components", "elements"].flatMap((directory) =>
      readdirSync(resolve(sourceDirectory, directory), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    ),
  );
  const unknown = implementationFiles().flatMap((path) =>
    [...readFileSync(path, "utf8").matchAll(/data-uiify-([a-z]+(?:-[a-z]+)*)/g)]
      .map((match) => match[1]!)
      .filter((name) => !folders.has(name) && !IDENTITY_SUBNAMES.has(name))
      .map((name) => `${path}: ${name}`),
  );
  expect(unknown).toEqual([]);
});
