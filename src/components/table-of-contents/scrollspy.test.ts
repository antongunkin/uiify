import { describe, expect, it } from "vitest";
import { getTableOfContentsValue, resolveTableOfContentsId } from "./scrollspy.js";
import type { TableOfContentsScrollSnapshot } from "./types.js";
const url = "https://example.test/article?lang=en";
function snapshot(
  starts: readonly number[],
  overrides: Partial<TableOfContentsScrollSnapshot> = {},
): TableOfContentsScrollSnapshot {
  return {
    targets: starts.map((start, index) => ({
      value: ["intro", "setup", "config"][index] ?? String(index),
      start,
      visible: true,
    })),
    viewportStart: 0,
    viewportEnd: 800,
    offset: 80,
    contentEnd: 2000,
    ...overrides,
  };
}
describe("TableOfContents scroll selection", () => {
  it("chooses the last heading above the activation line", () => {
    expect(getTableOfContentsValue(snapshot([40, 300, 1200]))).toBe("intro");
    expect(
      getTableOfContentsValue(snapshot([40, 300, 1200], { viewportStart: 400, viewportEnd: 1200 })),
    ).toBe("setup");
  });
  it("retains the section across gaps and can jump or scroll backwards", () => {
    expect(
      getTableOfContentsValue(snapshot([40, 300, 1200], { viewportStart: 700, viewportEnd: 1500 })),
    ).toBe("setup");
    expect(
      getTableOfContentsValue(
        snapshot([40, 300, 1200], { viewportStart: 1300, viewportEnd: 2100 }),
      ),
    ).toBe("config");
    expect(
      getTableOfContentsValue(snapshot([40, 300, 1200], { viewportStart: 10, viewportEnd: 810 })),
    ).toBe("intro");
  });
  it("selects the first before any heading and the last at the content end", () => {
    expect(getTableOfContentsValue(snapshot([100, 300, 1400]))).toBe("intro");
    expect(
      getTableOfContentsValue(
        snapshot([100, 300, 1400], { viewportStart: 800, viewportEnd: 1600, contentEnd: 1600 }),
      ),
    ).toBe("config");
  });
  it("does not claim the last section has been reached in a short unscrolled article", () => {
    expect(getTableOfContentsValue(snapshot([100, 300, 500], { contentEnd: 700 }))).toBe("intro");
  });
  it("ignores hidden targets and has no selection without valid targets", () => {
    expect(getTableOfContentsValue(snapshot([]))).toBe(null);
    expect(
      getTableOfContentsValue(
        snapshot([], { targets: [{ value: "hidden", start: 0, visible: false }] }),
      ),
    ).toBe(null);
    expect(
      getTableOfContentsValue(
        snapshot([], {
          targets: [
            { value: "intro", start: 40, visible: true },
            { value: "hidden", start: 50, visible: false },
          ],
        }),
      ),
    ).toBe("intro");
  });
});
describe("TableOfContents fragment resolution", () => {
  it.each([
    ["#a%20b", "a b"],
    ["#intro", "intro"],
    ["https://example.test/article?lang=en#intro", "intro"],
    ["/article?lang=en#intro", "intro"],
    ["/other#intro", null],
    ["?lang=fr#intro", null],
    ["https://elsewhere.test/article?lang=en#intro", null],
    ["#", null],
    ["#bad%escape", null],
    ["javascript:alert(1)", null],
  ])("resolves %s to %s", (href, value) => {
    expect(resolveTableOfContentsId(href, url)).toBe(value);
  });
});
