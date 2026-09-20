import { describe, it, expect } from "vitest";
import { useLayoutEffect } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";

describe("useIsomorphicLayoutEffect", () => {
  it("aliases useLayoutEffect in a DOM environment (jsdom has window)", () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });
});
