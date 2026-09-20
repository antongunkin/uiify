import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUnmount } from "./use-unmount.js";

describe("useUnmount", () => {
  it("calls the callback once on unmount and not on re-render", () => {
    const fn = vi.fn();
    const { rerender, unmount } = renderHook(() => useUnmount(fn));
    rerender();
    expect(fn).not.toHaveBeenCalled();
    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
