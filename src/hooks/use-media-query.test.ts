import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./use-media-query.js";

describe("useMediaQuery", () => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  beforeEach(() => {
    addEventListener.mockReset();
    removeEventListener.mockReset();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(min-width: 768px)",
        media: query,
        addEventListener,
        removeEventListener,
      })),
    );
  });

  it("returns the current match for the query", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false for a non-matching query", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 9999px)"));
    expect(result.current).toBe(false);
  });

  it("shares one MediaQueryList subscription for duplicate queries", () => {
    const { unmount } = renderHook(() => [
      useMediaQuery("(min-width: 768px)"),
      useMediaQuery("(min-width: 768px)"),
    ]);

    expect(window.matchMedia).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledTimes(1);

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});
