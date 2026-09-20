import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createIntersectionObserverMock } from "./test-utils.js";
import { useHeaderScrollState } from "./use-header-scroll-state.js";

describe("useHeaderScrollState", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.stubGlobal("scrollY", 0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("defaults scrolled and hidden to false", () => {
    const { result } = renderHook(() => useHeaderScrollState());
    expect(result.current).toEqual({ scrolled: false, hidden: false });
  });

  it("does not observe or listen when behavior is none", () => {
    const io = createIntersectionObserverMock();
    const addSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => useHeaderScrollState({ behavior: "none" }));
    expect(io.observe).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("does not attach listeners when disabled", () => {
    const io = createIntersectionObserverMock();
    const addSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => useHeaderScrollState({ behavior: "hide-on-scroll-down", disabled: true }));
    expect(io.observe).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it.each(["elevate-on-scroll", "solid-on-scroll"] as const)(
    "sets scrolled from IntersectionObserver when behavior=%s",
    async (behavior) => {
      const io = createIntersectionObserverMock();
      const { result } = renderHook(() => useHeaderScrollState({ behavior }));

      expect(document.querySelector("[data-header-scroll-sentinel]")).not.toBeNull();
      expect(io.observe).toHaveBeenCalled();

      act(() => {
        io.trigger([{ isIntersecting: false } as IntersectionObserverEntry]);
      });
      await waitFor(() => expect(result.current.scrolled).toBe(true));

      act(() => {
        io.trigger([{ isIntersecting: true } as IntersectionObserverEntry]);
      });
      await waitFor(() => expect(result.current.scrolled).toBe(false));
    },
  );

  it("applies threshold via IntersectionObserver rootMargin", () => {
    const io = createIntersectionObserverMock();
    renderHook(() => useHeaderScrollState({ behavior: "elevate-on-scroll", threshold: 12 }));
    expect(io.observe).toHaveBeenCalled();
  });

  it("sets hidden while scrolling down past threshold", async () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 10, writable: true });

    const { result } = renderHook(() =>
      useHeaderScrollState({ behavior: "hide-on-scroll-down", threshold: 10 }),
    );

    act(() => {
      window.scrollY = 30;
      window.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => expect(result.current.scrolled).toBe(true));
    await waitFor(() => expect(result.current.hidden).toBe(true));
  });

  it("removes sentinel on unmount for IntersectionObserver behaviors", () => {
    createIntersectionObserverMock();
    const { unmount } = renderHook(() => useHeaderScrollState({ behavior: "solid-on-scroll" }));
    expect(document.querySelector("[data-header-scroll-sentinel]")).not.toBeNull();
    unmount();
    expect(document.querySelector("[data-header-scroll-sentinel]")).toBeNull();
  });

  it("uses scrollRoot for IntersectionObserver when provided", async () => {
    const io = createIntersectionObserverMock();
    const scrollRoot = document.createElement("div");
    document.body.appendChild(scrollRoot);

    const { result } = renderHook(() =>
      useHeaderScrollState({ behavior: "elevate-on-scroll", scrollRoot }),
    );

    expect(scrollRoot.querySelector("[data-header-scroll-sentinel]")).not.toBeNull();
    expect(io.observe).toHaveBeenCalled();

    act(() => {
      io.trigger([{ isIntersecting: false } as IntersectionObserverEntry]);
    });
    await waitFor(() => expect(result.current.scrolled).toBe(true));

    scrollRoot.remove();
  });

  it("uses scrollRoot scroll events for hide-on-scroll-down", async () => {
    const scrollRoot = document.createElement("div");
    Object.defineProperty(scrollRoot, "scrollTop", {
      configurable: true,
      value: 0,
      writable: true,
    });
    document.body.appendChild(scrollRoot);

    const { result } = renderHook(() =>
      useHeaderScrollState({ behavior: "hide-on-scroll-down", scrollRoot, threshold: 8 }),
    );

    act(() => {
      scrollRoot.scrollTop = 24;
      scrollRoot.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => expect(result.current.scrolled).toBe(true));
    await waitFor(() => expect(result.current.hidden).toBe(true));

    scrollRoot.remove();
  });
});
