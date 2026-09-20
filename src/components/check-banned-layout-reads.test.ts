/**
 * Unit tests for the check-banned-layout-reads script.
 *
 * Imports the pure `findBannedReads` function and verifies:
 *   1. A bare banned property read is flagged.
 *   2. A banned read annotated with `// banned-read-ok:` is allowed.
 *   3. A banned property name that appears only in a string literal is NOT flagged.
 *   4. A `getComputedStyle()` call is flagged.
 *   5. A `getComputedStyle()` call with an allow-comment is NOT flagged.
 *   6. All property names in the banned set are covered.
 */

// NOTE: verbatimModuleSyntax requires a relative path ending in the actual
// extension on disk. The script is .mjs, so we must use that extension.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — .mjs import; TS cannot resolve this with bundler resolution but
//             Vitest handles it via native ESM. The function's return type is
//             inferred at test time.
import { findBannedReads as _findBannedReads } from "../../scripts/check-banned-layout-reads.mjs";
import { describe, it, expect } from "vitest";

interface BannedReadHit {
  file: string;
  line: number;
  column: number;
  identifier: string;
  snippet: string;
}

/** Typed wrapper so strict mode is satisfied despite the .mjs @ts-ignore above. */
const findBannedReads = _findBannedReads as (
  fileName: string,
  sourceText: string,
) => BannedReadHit[];

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

/** Wrap source in a minimal TS context so the parser is happy. */
function wrapTs(body: string): string {
  return `const el = document.createElement("div");\n${body}\n`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("findBannedReads", () => {
  // --- Property reads that MUST be flagged ---

  it("flags a plain offsetWidth read", () => {
    const source = wrapTs("const w = el.offsetWidth;");
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.identifier).toBe("offsetWidth");
  });

  it("flags a plain offsetHeight read", () => {
    const source = wrapTs("const h = el.offsetHeight;");
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.identifier).toBe("offsetHeight");
  });

  it("flags clientWidth", () => {
    const source = wrapTs("const w = el.clientWidth;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "clientWidth")).toBe(true);
  });

  it("flags clientHeight", () => {
    const source = wrapTs("const h = el.clientHeight;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "clientHeight")).toBe(true);
  });

  it("flags scrollTop", () => {
    const source = wrapTs("const t = el.scrollTop;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "scrollTop")).toBe(true);
  });

  it("flags scrollLeft", () => {
    const source = wrapTs("const l = el.scrollLeft;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "scrollLeft")).toBe(true);
  });

  it("flags scrollWidth", () => {
    const source = wrapTs("const sw = el.scrollWidth;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "scrollWidth")).toBe(true);
  });

  it("flags scrollHeight", () => {
    const source = wrapTs("const sh = el.scrollHeight;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "scrollHeight")).toBe(true);
  });

  it("flags innerText", () => {
    const source = wrapTs("const t = el.innerText;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "innerText")).toBe(true);
  });

  it("flags offsetLeft", () => {
    const source = wrapTs("const l = el.offsetLeft;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "offsetLeft")).toBe(true);
  });

  it("flags offsetTop", () => {
    const source = wrapTs("const t = el.offsetTop;");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "offsetTop")).toBe(true);
  });

  it("flags getBoundingClientRect call", () => {
    const source = wrapTs("const rect = el.getBoundingClientRect();");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "getBoundingClientRect")).toBe(true);
  });

  it("flags getClientRects call", () => {
    const source = wrapTs("const rects = el.getClientRects();");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "getClientRects")).toBe(true);
  });

  it("flags getComputedStyle call", () => {
    const source = wrapTs("const style = getComputedStyle(el);");
    const hits = findBannedReads("test.ts", source);
    expect(hits.some((h) => h.identifier === "getComputedStyle")).toBe(true);
  });

  // --- Allow-comment suppression ---

  it("allows a banned read annotated with // banned-read-ok:", () => {
    const source = wrapTs(
      "const w = el.offsetWidth; // banned-read-ok: separated from write in RAF, trace verified",
    );
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  it("allows getComputedStyle annotated with // banned-read-ok:", () => {
    const source = wrapTs(
      "const style = getComputedStyle(el); // banned-read-ok: outside render loop, zero forced-layout",
    );
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  it("allows a banned read with a case-insensitive BANNED-READ-OK: comment", () => {
    const source = wrapTs("const h = el.clientHeight; // BANNED-READ-OK: documented exception");
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  // --- String literals must NOT be flagged ---

  it("does not flag a banned name inside a string literal", () => {
    const source = wrapTs('const key = "offsetWidth";');
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  it("does not flag a banned name inside a comment", () => {
    const source = wrapTs("// We never call getBoundingClientRect here");
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  it("does not flag a banned name in a type annotation", () => {
    // Type-level references don't produce a PropertyAccessExpression at runtime
    const source = wrapTs('type Keys = "offsetWidth" | "clientWidth";');
    const hits = findBannedReads("test.ts", source);
    expect(hits).toHaveLength(0);
  });

  // --- Multiple violations in one file ---

  it("returns all violations when multiple banned reads are present", () => {
    const source = wrapTs(`
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const style = getComputedStyle(el);
    `);
    const hits = findBannedReads("test.ts", source);
    expect(hits.length).toBeGreaterThanOrEqual(3);
  });

  // --- Hit shape ---

  it("hit includes correct line number, identifier and non-empty snippet", () => {
    const source = "const el = document.createElement('div');\nconst w = el.offsetWidth;\n";
    const hits = findBannedReads("myfile.ts", source);
    expect(hits).toHaveLength(1);
    const hit = hits[0]!;
    expect(hit.file).toBe("myfile.ts");
    expect(hit.line).toBe(2);
    expect(hit.identifier).toBe("offsetWidth");
    expect(hit.snippet).toBeTruthy();
  });
});
