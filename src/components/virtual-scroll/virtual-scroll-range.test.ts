import { describe, expect, it } from "vitest";
import {
  computeVirtualScrollRange,
  rangesEqual,
  type VirtualScrollRange,
} from "./virtual-scroll-range.js";
import { VIRTUAL_SCROLL_OVERSCAN, VIRTUAL_SCROLL_ROW_HEIGHT } from "./types.js";

const ROW = VIRTUAL_SCROLL_ROW_HEIGHT;
const OVERSCAN = VIRTUAL_SCROLL_OVERSCAN;
const VIEWPORT = 600;

function range(
  scrollTop: number,
  overrides: Partial<Parameters<typeof computeVirtualScrollRange>[0]> = {},
): VirtualScrollRange {
  return computeVirtualScrollRange({
    scrollTop,
    viewportHeight: VIEWPORT,
    itemCount: 10_000,
    rowHeight: ROW,
    overscan: OVERSCAN,
    ...overrides,
  });
}

describe("computeVirtualScrollRange", () => {
  it("returns an empty slice for zero items", () => {
    expect(
      computeVirtualScrollRange({
        scrollTop: 0,
        viewportHeight: VIEWPORT,
        itemCount: 0,
        rowHeight: ROW,
        overscan: OVERSCAN,
      }),
    ).toEqual({ start: 0, end: 0, visibleStart: 0, visibleEnd: 0, offsetY: 0 });
  });

  it("returns a single-row slice at the list start", () => {
    expect(range(0, { itemCount: 1, overscan: 0 })).toEqual({
      start: 0,
      end: 1,
      visibleStart: 0,
      visibleEnd: 0,
      offsetY: 0,
    });
  });

  it("includes overscan rows above and below the viewport at scrollTop 0", () => {
    const result = range(0);
    const visible = Math.ceil(VIEWPORT / ROW);
    expect(result).toEqual({
      start: 0,
      end: visible + OVERSCAN,
      visibleStart: 0,
      visibleEnd: visible - 1,
      offsetY: 0,
    });
  });

  it("offsets the window when scrolled past overscan", () => {
    const scrollTop = ROW * 10;
    const result = range(scrollTop);
    expect(result.start).toBe(10 - OVERSCAN);
    expect(result.offsetY).toBe(result.start * ROW);
  });

  it("keeps the same range for sub-row scroll deltas", () => {
    const base = range(ROW * 10);
    const withinRow = range(ROW * 10 + 20);
    expect(withinRow).toEqual(base);
  });

  it("includes a row that becomes partially visible after a sub-row scroll", () => {
    const result = computeVirtualScrollRange({
      scrollTop: 81,
      viewportHeight: 426,
      itemCount: 100,
      rowHeight: 220,
      overscan: 0,
    });

    expect(result.visibleEnd).toBe(2);
    expect(result.end).toBe(3);
  });

  it("advances the range when the first visible row index changes", () => {
    const before = range(ROW * 10 + 30);
    const after = range(ROW * 11);
    expect(after.start).toBe(before.start + 1);
    expect(after.end).toBe(before.end + 1);
    expect(after.offsetY).toBe(before.offsetY + ROW);
  });

  it("clamps the end index at itemCount near the list tail", () => {
    const itemCount = 25;
    const scrollTop = ROW * 20;
    const result = range(scrollTop, { itemCount });
    expect(result.end).toBe(itemCount);
    expect(result.start).toBeGreaterThan(0);
  });

  it("respects custom rowHeight and overscan", () => {
    const result = computeVirtualScrollRange({
      scrollTop: 200,
      viewportHeight: 400,
      itemCount: 500,
      rowHeight: 50,
      overscan: 2,
    });
    expect(result.start).toBe(Math.max(0, Math.floor(200 / 50) - 2));
    expect(result.offsetY).toBe(result.start * 50);
  });

  it("treats negative scrollTop as zero", () => {
    expect(range(-100)).toEqual(range(0));
  });

  it("handles a viewport shorter than one row", () => {
    const result = range(0, { viewportHeight: 32, overscan: 0, itemCount: 100 });
    expect(result.end - result.start).toBe(Math.ceil(32 / ROW));
  });
});

describe("rangesEqual", () => {
  it("compares start/end only", () => {
    const left: VirtualScrollRange = {
      start: 5,
      end: 20,
      visibleStart: 8,
      visibleEnd: 16,
      offsetY: 320,
    };
    const right: VirtualScrollRange = {
      start: 5,
      end: 20,
      visibleStart: 9,
      visibleEnd: 17,
      offsetY: 999,
    };
    expect(rangesEqual(left, right)).toBe(true);
  });

  it("returns false when the visible slice changes", () => {
    expect(
      rangesEqual(
        { start: 5, end: 20, visibleStart: 8, visibleEnd: 16, offsetY: 320 },
        { start: 6, end: 21, visibleStart: 9, visibleEnd: 17, offsetY: 384 },
      ),
    ).toBe(false);
  });
});
