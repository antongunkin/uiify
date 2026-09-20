import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottledCallback } from "./use-throttled-callback.js";

describe("useThrottledCallback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires immediately, then throttles further calls within the window", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(fn, 100));
    act(() => result.current("a")); // leading call fires now
    expect(fn).toHaveBeenCalledTimes(1);
    act(() => {
      result.current("b"); // within window -> scheduled trailing
      result.current("c"); // trailing edge should use the latest call
    });
    expect(fn).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(100));
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("c");
  });
});
