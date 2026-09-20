import { describe, expect, it } from "vitest";
import {
  computeScrollAdjustmentForRowResize,
  createVirtualScrollMeasurementStore,
} from "./virtual-scroll-measurements.js";

describe("createVirtualScrollMeasurementStore", () => {
  it("builds prefix offsets for fixed default heights", () => {
    const measuredHeights = new Map<string, number>();
    const store = createVirtualScrollMeasurementStore({
      itemCount: 4,
      defaultRowHeight: 50,
      measuredHeights,
      itemIdAtIndex: (index) => String(index + 1),
    });

    expect(store.getRowOffset(0)).toBe(0);
    expect(store.getRowOffset(2)).toBe(100);
    expect(store.getTotalSize()).toBe(200);
    expect(store.getRowHeight(1)).toBe(50);
  });

  it("uses measured heights keyed by item id", () => {
    const measuredHeights = new Map<string, number>();
    const store = createVirtualScrollMeasurementStore({
      itemCount: 3,
      defaultRowHeight: 40,
      measuredHeights,
      itemIdAtIndex: (index) => ["a", "b", "c"][index],
    });

    store.setMeasuredHeight("b", 1, 80);
    expect(store.getRowHeight(1)).toBe(80);
    expect(store.getTotalSize()).toBe(160);
  });

  it("finds start/end indices from scroll offsets", () => {
    const measuredHeights = new Map<string, number>();
    const store = createVirtualScrollMeasurementStore({
      itemCount: 5,
      defaultRowHeight: 100,
      measuredHeights,
      itemIdAtIndex: (index) => String(index),
    });

    expect(store.findStartIndex(250)).toBe(2);
    expect(store.findEndIndex(350)).toBe(4);
  });
});

describe("computeScrollAdjustmentForRowResize", () => {
  it("adjusts scrollTop when a row above the viewport grows", () => {
    expect(
      computeScrollAdjustmentForRowResize({
        scrollTop: 200,
        rowOffset: 0,
        previousHeight: 64,
        nextHeight: 96,
      }),
    ).toBe(32);
  });

  it("skips adjustment when the resized row is below the viewport", () => {
    expect(
      computeScrollAdjustmentForRowResize({
        scrollTop: 200,
        rowOffset: 180,
        previousHeight: 64,
        nextHeight: 96,
      }),
    ).toBe(0);
  });
});
