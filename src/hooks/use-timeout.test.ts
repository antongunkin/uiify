import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimeout } from "./use-timeout.js";

describe("useTimeout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires after the delay and not when delay is null", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ delay }: { delay: number | null }) => useTimeout(fn, delay),
      { initialProps: { delay: 100 as number | null } },
    );
    act(() => vi.advanceTimersByTime(100));
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ delay: null });
    act(() => vi.advanceTimersByTime(1000));
    expect(fn).toHaveBeenCalledTimes(1); // paused
  });
});
