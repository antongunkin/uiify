import { describe, expect, it } from "vitest";
import { formatLabel } from "./format-label.js";

describe("formatLabel", () => {
  it("formats number placeholders with the requested locale", () => {
    expect(formatLabel("{index} of {count}", { index: 3, count: 5 })).toBe("3 of 5");
    expect(formatLabel("{count}", { count: 1000 })).toBe("1,000");
    expect(formatLabel("{index} من {count}", { index: 3, count: 5 }, "ar-EG")).toBe("٣ من ٥");
    expect(formatLabel("{count}枚中{index}枚目", { index: 3, count: 5 }, "ja-JP")).toBe(
      "5枚中3枚目",
    );
    expect(formatLabel("{n}", { n: 12345 }, "de-DE")).toBe("12.345");
  });

  it("inserts string placeholders verbatim", () => {
    expect(formatLabel("Go to {label}", { label: "Intro" })).toBe("Go to Intro");
  });

  it("preserves placeholders without a matching value", () => {
    expect(formatLabel("{missing} item", {})).toBe("{missing} item");
    expect(formatLabel("{toString} item", {})).toBe("{toString} item");
  });
});
