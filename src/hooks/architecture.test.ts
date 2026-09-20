import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Resolve from this file, not process.cwd(): the root vitest.config.ts include
// (`packages/*/src/**/*.test.{ts,tsx}`) picks this suite up when vitest runs
// from the repo root, where cwd-relative "src" reads throw ENOENT and the whole
// architecture gate fails to collect instead of asserting anything.
const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const productionFiles = readdirSync(SRC)
  .filter(
    (file) =>
      /\.(ts|tsx)$/.test(file) &&
      !file.includes(".test.") &&
      !file.endsWith("architecture.test.ts"),
  )
  .map((file) => join(SRC, file));

const bannedLayoutReadPattern =
  /\b(getBoundingClientRect|getClientRects|offsetWidth|offsetHeight|offsetLeft|offsetTop|clientWidth|clientHeight|scrollWidth|scrollHeight|innerText)\s*\(|getComputedStyle\s*\(/;

describe("package architecture", () => {
  it("contains no banned synchronous layout reads in production code", () => {
    for (const file of productionFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(bannedLayoutReadPattern);
    }
  });
});
