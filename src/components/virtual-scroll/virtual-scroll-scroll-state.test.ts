import { afterEach, describe, expect, it, vi } from "vitest";
import { createVirtualScrollScrollState } from "./virtual-scroll-scroll-state.js";

describe("createVirtualScrollScrollState", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits one true then false for a scroll burst", () => {
    vi.useFakeTimers();
    const states: boolean[] = [];
    const controller = createVirtualScrollScrollState({
      resetDelay: 150,
      supportsScrollEnd: false,
      onChange: (isScrolling) => states.push(isScrolling),
    });

    controller.notifyScroll();
    controller.notifyScroll();
    expect(states).toEqual([true]);

    vi.advanceTimersByTime(150);
    expect(states).toEqual([true, false]);

    controller.dispose();
  });

  it("settles immediately on scroll end when supported", () => {
    const states: boolean[] = [];
    const controller = createVirtualScrollScrollState({
      resetDelay: 150,
      supportsScrollEnd: true,
      onChange: (isScrolling) => states.push(isScrolling),
    });

    controller.notifyScroll();
    controller.notifyScrollEnd();
    expect(states).toEqual([true, false]);

    controller.dispose();
  });
});
