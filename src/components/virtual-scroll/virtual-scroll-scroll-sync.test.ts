import { describe, expect, it } from "vitest";
import { computeVirtualScrollRange } from "./virtual-scroll-range.js";
import { applyVirtualScrollRangeToDom } from "./virtual-scroll-scroll-sync.js";
import { VIRTUAL_SCROLL_OVERSCAN, VIRTUAL_SCROLL_ROW_HEIGHT } from "./types.js";

describe("applyVirtualScrollRangeToDom", () => {
  it("writes --uiify-range-start on the spacer for fixed-height lists", () => {
    const scrollport = document.createElement("div");
    const spacer = document.createElement("div");
    spacer.dataset.part = "spacer";
    scrollport.append(spacer);

    applyVirtualScrollRangeToDom(
      scrollport,
      {
        start: 42,
        end: 60,
        visibleStart: 47,
        visibleEnd: 56,
        offsetY: 42 * 64,
      },
      {
        dynamicLayout: false,
        slotCount: 20,
        getRowOffset: (index) => index * 64,
      },
    );

    expect(spacer.style.getPropertyValue("--uiify-range-start")).toBe("42");
  });

  it("writes per-row offsets for dynamic lists", () => {
    const scrollport = document.createElement("div");
    const spacer = document.createElement("div");
    spacer.dataset.part = "spacer";
    const row = document.createElement("div");
    row.dataset.part = "row";
    spacer.append(row);
    scrollport.append(spacer);

    applyVirtualScrollRangeToDom(
      scrollport,
      {
        start: 10,
        end: 12,
        visibleStart: 10,
        visibleEnd: 11,
        offsetY: 800,
      },
      {
        dynamicLayout: true,
        slotCount: 1,
        getRowOffset: (index) => index * 80,
      },
    );

    expect(row.style.getPropertyValue("--uiify-row-offset")).toBe("800px");
  });
});

describe("applyVirtualScrollRangeToDom range math", () => {
  it("range math matches fixed-height scroll at row 500", () => {
    const range = computeVirtualScrollRange({
      scrollTop: VIRTUAL_SCROLL_ROW_HEIGHT * 500,
      viewportHeight: 600,
      itemCount: 10_000,
      rowHeight: VIRTUAL_SCROLL_ROW_HEIGHT,
      overscan: VIRTUAL_SCROLL_OVERSCAN,
    });
    expect(range.start).toBe(500 - VIRTUAL_SCROLL_OVERSCAN);
  });
});
