import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useId } from "./use-id.js";

describe("useId", () => {
  it("generates a prefixed, colon-free id when none is provided", () => {
    const { result } = renderHook(() => useId());
    expect(result.current).toMatch(/^uiify-[\w-]+$/);
    expect(result.current).not.toContain(":");
  });

  it("returns the provided id verbatim", () => {
    const { result } = renderHook(() => useId("my-id"));
    expect(result.current).toBe("my-id");
  });
});
