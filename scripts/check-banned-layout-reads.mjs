/**
 * check-banned-layout-reads.mjs
 *
 * Scans production TypeScript source in @gunkin/uiify/hooks, @gunkin/uiify/core, and @gunkin/uiify/components
 * for synchronous geometry reads that force style/layout recalculation.
 *
 * Uses the TypeScript compiler AST to distinguish actual property reads from
 * harmless string literals that happen to contain the same name.
 *
 * An explicit `// banned-read-ok: <reason>` comment on the same, immediately
 * preceding, or immediately following line as a read marks it as a documented
 * exception.
 *
 * Usage (CLI):
 *   node scripts/check-banned-layout-reads.mjs
 *
 * Exported API (for unit tests):
 *   findBannedReads(fileName: string, sourceText: string): BannedReadHit[]
 */

import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Property names that force layout/style recalculation when read. */
const BANNED_PROPERTIES = new Set([
  "offsetWidth",
  "offsetHeight",
  "offsetLeft",
  "offsetTop",
  "clientWidth",
  "clientHeight",
  "scrollWidth",
  "scrollHeight",
  "scrollTop",
  "scrollLeft",
  "getBoundingClientRect",
  "getClientRects",
  "innerText",
]);

/**
 * A single violation found in a source file.
 * @typedef {{ file: string, line: number, column: number, identifier: string, snippet: string }} BannedReadHit
 */

/**
 * Scan `sourceText` (the content of `fileName`) for banned synchronous geometry
 * reads using the TypeScript AST.
 *
 * Rules:
 *  - Flags `PropertyAccessExpression` whose `.name.text` is in BANNED_PROPERTIES.
 *  - Flags any `CallExpression` whose callee text starts with `getComputedStyle`.
 *  - Suppresses a violation when the line contains `// banned-read-ok:`.
 *
 * @param {string} fileName  - Path used as the source file name in diagnostics.
 * @param {string} sourceText - Raw TypeScript/TSX source code.
 * @returns {BannedReadHit[]}
 */
export function findBannedReads(fileName, sourceText) {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const lines = sourceText.split("\n");
  /** @type {BannedReadHit[]} */
  const hits = [];

  /**
   * Return true if the given 0-based line index, its preceding line, or its
   * following line contains a `// banned-read-ok:` comment.
   * @param {number} lineIndex
   */
  function isAllowed(lineIndex) {
    const line = lines[lineIndex] ?? "";
    const previousLine = lines[lineIndex - 1] ?? "";
    const nextLine = lines[lineIndex + 1] ?? "";
    return [line, previousLine, nextLine].some((value) => /\/\/\s*banned-read-ok\s*:/i.test(value));
  }

  /**
   * Get { line, column } (both 1-based) from a node's start position.
   * @param {ts.Node} node
   */
  function locationOf(node) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    return { line: line + 1, column: character + 1, lineIndex: line };
  }

  /** @param {ts.Node} node */
  function visit(node) {
    // Flag PropertyAccessExpression whose name is a banned property.
    if (ts.isPropertyAccessExpression(node)) {
      const name = node.name.text;
      if (BANNED_PROPERTIES.has(name)) {
        const loc = locationOf(node.name);
        if (!isAllowed(loc.lineIndex)) {
          const snippet = (lines[loc.lineIndex] ?? "").trim();
          hits.push({
            file: fileName,
            line: loc.line,
            column: loc.column,
            identifier: name,
            snippet,
          });
        }
      }
    }

    // Flag CallExpression where the callee is `getComputedStyle` (any form).
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const calleeText = callee.getText(sourceFile);
      if (calleeText === "getComputedStyle" || calleeText.endsWith(".getComputedStyle")) {
        const loc = locationOf(callee);
        if (!isAllowed(loc.lineIndex)) {
          const snippet = (lines[loc.lineIndex] ?? "").trim();
          hits.push({
            file: fileName,
            line: loc.line,
            column: loc.column,
            identifier: "getComputedStyle",
            snippet,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hits;
}

// ---------------------------------------------------------------------------
// CLI entry — only runs when invoked directly via `node scripts/check-banned-layout-reads.mjs`
// ---------------------------------------------------------------------------

const isMain =
  typeof process !== "undefined" &&
  process.argv[1] !== undefined &&
  process.argv[1] !== null &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  const rootDir = resolve(fileURLToPath(import.meta.url), "..", "..");

  const SCAN_DIRS = [
    join(rootDir, "src", "hooks"),
    join(rootDir, "src", "core"),
    join(rootDir, "src", "components"),
  ];

  /**
   * Recursively collect .ts/.tsx files excluding tests and stories.
   * @param {string} dir
   * @returns {string[]}
   */
  function collectFiles(dir) {
    /** @type {string[]} */
    const results = [];
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return results;
    }
    for (const entry of entries) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...collectFiles(full));
      } else if (
        /\.(ts|tsx)$/.test(entry) &&
        !entry.includes(".test.") &&
        !entry.includes(".stories.") &&
        !entry.includes(".spec.")
      ) {
        results.push(full);
      }
    }
    return results;
  }

  /** @type {import('./check-banned-layout-reads.mjs').BannedReadHit[]} */
  const allHits = [];

  for (const dir of SCAN_DIRS) {
    const files = collectFiles(dir);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const hits = findBannedReads(file, source);
      allHits.push(...hits);
    }
  }

  if (allHits.length === 0) {
    console.log("check-banned-layout-reads: PASS — no banned synchronous geometry reads found.");
    process.exit(0);
  } else {
    console.error(
      "check-banned-layout-reads: FAIL — banned synchronous geometry reads detected:\n",
    );
    for (const hit of allHits) {
      console.error(`  ${hit.file}:${hit.line}:${hit.column}  [${hit.identifier}]`);
      console.error(`    ${hit.snippet}`);
    }
    console.error(`\n${allHits.length} violation(s) found.`);
    process.exit(1);
  }
}
