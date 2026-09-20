import { describe, expect, it } from "vitest";
import { resolveVirtualScrollAnchorAdjustment } from "./virtual-scroll-anchor.js";

describe("resolveVirtualScrollAnchorAdjustment", () => {
  it("follows append when pinned to the bottom", () => {
    expect(
      resolveVirtualScrollAnchorAdjustment({
        anchor: "end",
        followAppend: true,
        viewportHeight: 600,
        previous: {
          firstItemId: "1",
          itemCount: 100,
          totalSize: 6400,
          scrollTop: 5800,
        },
        next: {
          firstItemId: "1",
          itemCount: 101,
          totalSize: 6464,
          scrollTop: 5800,
        },
      }),
    ).toEqual({ delta: 64, behavior: "auto" });
  });

  it("preserves scroll position when rows are prepended", () => {
    expect(
      resolveVirtualScrollAnchorAdjustment({
        anchor: "start",
        followAppend: false,
        viewportHeight: 600,
        previous: {
          firstItemId: "10",
          itemCount: 100,
          totalSize: 6400,
          scrollTop: 640,
        },
        next: {
          firstItemId: "1",
          itemCount: 110,
          totalSize: 7040,
          scrollTop: 640,
        },
      }),
    ).toEqual({ delta: 640, behavior: "auto" });
  });
});
