import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDebouncedFn, createThrottledFn } from "./rate-limit.js";

describe("createDebouncedFn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes on the trailing edge", () => {
    const callback = vi.fn();
    const debounced = createDebouncedFn(callback, 100);
    debounced("a");
    debounced("b");
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("b");
  });

  it("cancel clears a pending invocation", () => {
    const callback = vi.fn();
    const debounced = createDebouncedFn(callback, 100);
    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();
  });
});

describe("createThrottledFn", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes immediately then on the trailing edge", () => {
    const callback = vi.fn();
    const throttled = createThrottledFn(callback, 100);
    throttled("first");
    expect(callback).toHaveBeenCalledOnce();
    throttled("second");
    expect(callback).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("second");
  });

  it("cancel clears a pending trailing invocation", () => {
    const callback = vi.fn();
    const throttled = createThrottledFn(callback, 100);
    throttled("first");
    throttled("second");
    throttled.cancel();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledOnce();
  });
});
