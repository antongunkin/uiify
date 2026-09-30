import { describe, expect, it } from "vitest";
import { readBox } from "./read-box.js";

describe("readBox", () => {
  it("returns the element's getBoundingClientRect result", () => {
    const element = document.createElement("div");
    const rect = { left: 1, right: 2, top: 3, bottom: 4 } as DOMRect;
    element.getBoundingClientRect = () => rect;
    expect(readBox(element)).toBe(rect);
  });
});
