import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWindowSize } from "./use-window-size.js";

describe("useWindowSize", () => {
  it("measures on mount and updates on resize", () => {
    (window as unknown as { innerWidth: number }).innerWidth = 800;
    (window as unknown as { innerHeight: number }).innerHeight = 600;
    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 800, height: 600 });

    (window as unknown as { innerWidth: number }).innerWidth = 1024;
    act(() => window.dispatchEvent(new Event("resize")));
    expect(result.current.width).toBe(1024);
  });

  it("shares one resize listener across hook instances", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const first = renderHook(() => useWindowSize());
    const second = renderHook(() => useWindowSize());

    expect(add.mock.calls.filter(([type]) => type === "resize")).toHaveLength(1);
    first.unmount();
    expect(remove.mock.calls.filter(([type]) => type === "resize")).toHaveLength(0);
    second.unmount();
    expect(remove.mock.calls.filter(([type]) => type === "resize")).toHaveLength(1);
  });
});
