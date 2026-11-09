import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { PART_NAMES } from "./core/part-names.js";

const sourceRoot = import.meta.dirname;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "test-utils" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$|test-utils\.ts$/.test(entry.name)
      ? [path]
      : [];
  });
}

const files = sourceFiles(sourceRoot).map((path) => ({
  path: relative(sourceRoot, path).replaceAll("\\", "/"),
  source: ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true),
}));

/** String fragments in code (not comments): literals, template text, JSX attribute names. */
function codeStrings(source: ts.SourceFile): string[] {
  const strings: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node)) strings.push(node.text);
    if (ts.isJsxAttribute(node)) strings.push(node.name.getText(source));
    ts.forEachChild(node, visit);
  };
  visit(source);
  return strings;
}

const LEGACY_MARKER = /(?<![\w-])data-(uiify-[a-z]|part\b)/;
const UIIFY_CLASS = /(?<![\w-])uiify-[a-z0-9]+(?:-[a-z0-9]+)*/g;
const folders = new Set([
  "menu",
  ...files.flatMap(({ path }) => {
    const match = /^(components|elements|blocks)\/([a-z0-9-]+)\//.exec(path);
    return match?.[2] && match[2] !== "internal" ? [match[2]] : [];
  }),
]);
const partNames = new Set<string>(PART_NAMES);
/**
 * Identities other components may render: a part that looks like a Button gets `uiify-button`
 * without importing Button (a component never imports another component's folder).
 */
const SHARED_IDENTITIES = [
  "button",
  "input",
  "textarea",
  "dialog",
  "popover",
  "menu",
  "slider-client",
];

/** `uiify-<folder>` or `uiify-<folder>-<part>`, for one of the allowed folders. */
function isValidClass(className: string, allowed: Iterable<string>): boolean {
  return [...allowed].some((folder) => {
    if (className === `uiify-${folder}`) return true;
    const prefix = `uiify-${folder}-`;
    return className.startsWith(prefix) && partNames.has(className.slice(prefix.length));
  });
}

describe("component identity classes", () => {
  it("every uiify-* class literal names its own component or Element and a known part", () => {
    const invalid = files.flatMap(({ path, source }) => {
      const own = /^(components|elements|blocks)\/([a-z0-9-]+)\//.exec(path)?.[2];
      const allowed =
        own === "enhance"
          ? ["tabs", "dialog", "drawer"]
          : own === "checkbox"
            ? [own, "checkbox-group", ...SHARED_IDENTITIES]
            : own && own !== "internal"
              ? [own, ...SHARED_IDENTITIES]
              : folders;
      return codeStrings(source)
        .flatMap((text) => text.match(UIIFY_CLASS) ?? [])
        .filter((className) => !isValidClass(className, allowed))
        .map((className) => `${path}: ${className}`);
    });
    expect(invalid).toEqual([]);
  });

  it("never renders or selects legacy identity attributes", () => {
    const legacy = files
      .filter(({ source }) => codeStrings(source).some((text) => LEGACY_MARKER.test(text)))
      .map(({ path }) => path)
      .sort();
    expect(legacy).toEqual([]);
  });
});
