import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventListener } from "./use-event-listener.js";

describe("useEventListener", () => {
  it("attaches to window by default and fires on dispatch", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("resize", handler));
    window.dispatchEvent(new Event("resize"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener("resize", handler));
    unmount();
    window.dispatchEvent(new Event("resize"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not treat an explicit null target as window", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("click", handler, null));
    window.dispatchEvent(new Event("click"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not resubscribe for equivalent inline options", () => {
    const add = vi.spyOn(window, "addEventListener");
    const handler = vi.fn();
    const { rerender } = renderHook(() =>
      useEventListener("resize", handler, undefined, { passive: true }),
    );

    rerender();

    const resizeSubscriptions = add.mock.calls.filter(([type]) => type === "resize");
    expect(resizeSubscriptions).toHaveLength(1);
  });
});
