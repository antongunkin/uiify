import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInterval } from "./use-interval.js";

describe("useInterval", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires repeatedly until delay is set to null", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ delay }: { delay: number | null }) => useInterval(fn, delay),
      { initialProps: { delay: 50 as number | null } },
    );
    act(() => vi.advanceTimersByTime(150));
    expect(fn).toHaveBeenCalledTimes(3);
    rerender({ delay: null });
    act(() => vi.advanceTimersByTime(500));
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
