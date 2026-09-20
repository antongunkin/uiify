import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrevious } from "./use-previous.js";

describe("usePrevious", () => {
  it("returns undefined first, then the prior value", () => {
    const { result, rerender } = renderHook(({ count }: { count: number }) => usePrevious(count), {
      initialProps: { count: 0 },
    });
    expect(result.current).toBeUndefined();
    rerender({ count: 1 });
    expect(result.current).toBe(0);
    rerender({ count: 2 });
    expect(result.current).toBe(1);
  });
});
