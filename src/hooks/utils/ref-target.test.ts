import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { isRefObject, resolveTarget } from "./ref-target.js";

describe("ref-target", () => {
  it("detects ref objects", () => {
    const ref = createRef<HTMLDivElement>();
    expect(isRefObject(ref)).toBe(true);
    expect(isRefObject(document.body)).toBe(false);
  });

  it("defaults to window when target is undefined", () => {
    expect(resolveTarget(undefined)).toBe(window);
  });

  it("reads ref.current for ref objects", () => {
    const node = document.createElement("div");
    const ref = { current: node };
    expect(resolveTarget(ref)).toBe(node);
  });

  it("returns direct event targets unchanged", () => {
    expect(resolveTarget(document.body)).toBe(document.body);
  });
});
