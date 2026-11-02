// Pins where the compiler reports a mistake in a document written in code, and how long the
// message is. The cases are the ones in documents.typecheck.test.ts with their
// `@ts-expect-error` lines blanked (so every line number stays), compiled in memory with the
// package's own tsconfig. Each error must start on the line of the wrong key or value, which
// is the line right below its expect-error comment, and read in at most two lines.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const tsconfigPath = resolve(here, "../../tsconfig.json");
const caseFiles = ["documents.typecheck.test.ts", "documents.typecheck.test.tsx"];

const expectError = /^\s*\/\/ @ts-expect-error\b/;
const exportedConst = /^export const (\w+)\b/;

interface CaseSource {
  readonly path: string;
  readonly virtualPath: string;
  readonly lines: readonly string[];
  readonly text: string;
}

interface Expectation {
  readonly line: number;
  readonly name: string;
  readonly path: string;
}

const sources: CaseSource[] = caseFiles.map((file) => {
  const path = resolve(here, file);
  const lines = readFileSync(path, "utf8").split("\n");
  // Blank the expect-error lines instead of removing them, so every line number stays.
  const text = lines.map((line) => (expectError.test(line) ? "" : line)).join("\n");
  return { path, virtualPath: path.replace(/\.test\.(tsx?)$/, ".virtual.$1"), lines, text };
});

const expectations: Expectation[] = sources.flatMap((source) => {
  let name = "";
  return source.lines.flatMap((line, index) => {
    name = exportedConst.exec(line)?.[1] ?? name;
    // The error belongs on the line right below the comment (1-based: index + 2).
    return expectError.test(line) ? [{ line: index + 2, name, path: source.virtualPath }] : [];
  });
});

/**
 * What each case must report: how many errors, the wording a reader needs to fix the mistake,
 * and the key or value the error points at. Every case is a single mistake, so one error.
 */
const cases: Readonly<
  Record<
    string,
    { readonly mentions: readonly string[]; readonly at: string; readonly long?: true }
  >
> = {
  unknownType: { mentions: ['"Buton"'], at: "type" },
  unknownProp: { mentions: ["'colour'", "ButtonProps"], at: "colour" },
  valueOutsideSet: { mentions: ['"primary"', '"secondary"', '"destructive"'], at: "variant" },
  missingRequiredProp: { mentions: ["fieldId"], at: "props" },
  childrenOnLeaf: { mentions: ["children", "Select.Separator"], at: "children" },
  unsafeUrl: { mentions: ['"javascript:alert(1)"', "https://"], at: "href" },
  unsafeAvatarSrc: { mentions: ['"javascript:alert(1)"', "https://"], at: "src" },
  childNotTextOrNode: { mentions: ["number"], at: "5" },
  nodeWithoutType: { mentions: ["props"], at: "{ props: {} }" },
  // TypeScript compares a React element with every node shape: a longer message that names `key`.
  rawJsxChild: { mentions: ["key"], at: "element", long: true },
};

function compile(): readonly ts.Diagnostic[] {
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(tsconfigPath));
  const options: ts.CompilerOptions = { ...parsed.options, noEmit: true, incremental: false };
  const host = ts.createCompilerHost(options);
  const { getSourceFile, fileExists, readFile } = host;
  const virtual = new Map(sources.map((source) => [source.virtualPath, source.text]));
  host.getSourceFile = (name, languageVersion, ...rest) => {
    const text = virtual.get(resolve(name));
    return text === undefined
      ? getSourceFile.call(host, name, languageVersion, ...rest)
      : ts.createSourceFile(name, text, languageVersion, true);
  };
  host.fileExists = (name) => virtual.has(resolve(name)) || fileExists.call(host, name);
  host.readFile = (name) => virtual.get(resolve(name)) ?? readFile.call(host, name);
  const program = ts.createProgram([...virtual.keys()], options, host);
  return [...virtual.keys()].flatMap((path) => {
    const file = program.getSourceFile(path);
    return [...program.getSyntacticDiagnostics(file), ...program.getSemanticDiagnostics(file)];
  });
}

describe("document type diagnostics", () => {
  let diagnostics: readonly ts.Diagnostic[] = [];
  beforeAll(() => {
    diagnostics = compile();
  }, 120_000);

  const place = (diagnostic: ts.Diagnostic) => ({
    path: resolve(diagnostic.file!.fileName),
    line: diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!).line + 1,
  });
  const messageOf = (diagnostic: ts.Diagnostic): string =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  it("covers every case", () => {
    expect(expectations.map(({ name }) => name).sort()).toEqual(Object.keys(cases).sort());
  });

  it("reports nothing outside the cases", () => {
    const expected = new Set(expectations.map(({ path, line }) => `${path}:${line}`));
    for (const diagnostic of diagnostics) {
      const { path, line } = place(diagnostic);
      expect(expected.has(`${path}:${line}`), `unexpected: ${messageOf(diagnostic)}`).toBe(true);
    }
  });

  describe.each(expectations)("$name", ({ name, line, path }) => {
    const spec = cases[name]!;
    const found = () =>
      diagnostics.filter((diagnostic) => {
        const at = place(diagnostic);
        return at.path === path && at.line === line;
      });

    it("reports exactly one error, on the line of the wrong key or value", () => {
      expect(found().map(messageOf)).toHaveLength(1);
    });

    it("points at the wrong key or value and names the fix", () => {
      const [diagnostic] = found();
      const span = diagnostic!.file!.text.slice(
        diagnostic!.start,
        diagnostic!.start! + diagnostic!.length!,
      );
      expect(span.startsWith(spec.at), `points at ${span.slice(0, 40)}`).toBe(true);
      const message = messageOf(diagnostic!);
      for (const text of spec.mentions) expect(message).toContain(text);
    });

    it.skipIf(spec.long)("explains the error in at most two lines", () => {
      const [diagnostic] = found();
      expect(messageOf(diagnostic!).split("\n").length).toBeLessThanOrEqual(2);
    });
  });
});
