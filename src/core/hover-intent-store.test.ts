import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHoverIntentStore } from "./hover-intent-store.js";

describe("createHoverIntentStore", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens after the configured delay", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    store.scheduleOpen(open);
    expect(open).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(open).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("runs synchronously when the delay is zero or negative", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    store.scheduleOpen(open, 0);
    expect(open).toHaveBeenCalledTimes(1);
    store.scheduleOpen(open, -1);
    expect(open).toHaveBeenCalledTimes(2);
  });

  it("replaces its own pending timer instead of stacking", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    store.scheduleOpen(open);
    store.scheduleOpen(open);
    vi.advanceTimersByTime(300);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("keeps open and close timers independent", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    const close = vi.fn();
    store.scheduleOpen(open);
    store.scheduleClose(close);
    store.clearCloseTimer();
    vi.advanceTimersByTime(500);
    expect(open).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
  });

  it("clearAll cancels both", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    const close = vi.fn();
    store.scheduleOpen(open);
    store.scheduleClose(close);
    store.clearAll();
    vi.advanceTimersByTime(500);
    expect(open).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it("uses updated options for timers scheduled after the update", () => {
    const store = createHoverIntentStore({ closeDelay: 100, openDelay: 300 });
    const open = vi.fn();
    store.updateOptions({ closeDelay: 100, openDelay: 50 });
    store.scheduleOpen(open);
    vi.advanceTimersByTime(50);
    expect(open).toHaveBeenCalledTimes(1);
  });
});
