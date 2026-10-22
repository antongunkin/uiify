import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

const packageRoot = resolve(import.meta.dirname, "..");
function hasClientDirective(text: string): boolean {
  const file = ts.createSourceFile(
    "module.tsx",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  for (const statement of file.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) break;
    if (statement.expression.text === "use client") return true;
  }
  return false;
}
const dist = (path: string) => readFileSync(resolve(packageRoot, "dist", path), "utf8");
function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

it("keeps public aggregate entrypoints usable from server modules", () => {
  for (const entry of ["index.js", "components/index.js", "core/index.js", "hooks/index.js"]) {
    expect(hasClientDirective(dist(entry)), entry).toBe(false);
  }
});

it("emits every production module with its own source directive", () => {
  const configPath = resolve(packageRoot, "tsconfig.build.json");
  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  expect(loaded.error).toBeUndefined();
  const parsed = ts.parseJsonConfigFileContent(loaded.config, ts.sys, packageRoot);
  expect(parsed.errors).toEqual([]);
  expect(parsed.fileNames.length).toBeGreaterThan(0);
  for (const input of parsed.fileNames.filter((file) => !file.endsWith(".d.ts"))) {
    const relativePath = input.slice(resolve(packageRoot, "src").length + 1).replace(/\.tsx?$/, "");
    const emitted = dist(`${relativePath}.js`);
    expect(hasClientDirective(emitted), relativePath).toBe(
      hasClientDirective(readFileSync(input, "utf8")),
    );
    expect(existsSync(resolve(packageRoot, "dist", `${relativePath}.d.ts`)), relativePath).toBe(
      true,
    );
  }
});

it("ships no development modules", () => {
  const files = walk(resolve(packageRoot, "dist"));
  expect(files.length).toBeGreaterThan(0);
  expect(
    files.filter((file) => /\.test\.|\.stories\.|test-utils|tier-manifest/.test(file)),
  ).toEqual([]);
});

it("keeps every relative emitted import resolvable", () => {
  for (const path of walk(resolve(packageRoot, "dist")).filter((file) => file.endsWith(".js"))) {
    const text = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    function visit(node: ts.Node): void {
      let specifier: string | undefined;
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        specifier = node.moduleSpecifier.text;
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        specifier = node.arguments[0].text;
      }
      if (specifier?.startsWith(".")) {
        expect(specifier, path).not.toMatch(/\.tsx?$/);
        expect(existsSync(resolve(path, "..", specifier)), `${path} -> ${specifier}`).toBe(true);
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
});
