import { describe, expect, it } from "vitest";
import { intersectionEntryChanged, serializeThreshold } from "./intersection.js";

describe("intersection utils", () => {
  it("serializes thresholds consistently", () => {
    expect(serializeThreshold(undefined)).toBe("0");
    expect(serializeThreshold(0.5)).toBe("0.5");
    expect(serializeThreshold([1, 0, 0.5])).toBe("0,0.5,1");
  });

  it("detects intersection entry changes", () => {
    const previous = {
      isIntersecting: false,
      intersectionRatio: 0,
    } as IntersectionObserverEntry;
    const next = {
      isIntersecting: true,
      intersectionRatio: 1,
    } as IntersectionObserverEntry;
    expect(intersectionEntryChanged(previous, next)).toBe(true);
    expect(intersectionEntryChanged(next, next)).toBe(false);
  });
});
