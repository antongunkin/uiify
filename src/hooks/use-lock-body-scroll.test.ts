import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLockBodyScroll } from "./use-lock-body-scroll.js";

const root = document.documentElement;

describe("useLockBodyScroll", () => {
  it("hides overflow and reserves the scrollbar gutter while locked", () => {
    root.style.overflow = "auto";
    root.style.scrollbarGutter = "";
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    expect(root.style.overflow).toBe("hidden");
    expect(root.style.scrollbarGutter).toBe("stable");
    unmount();
    expect(root.style.overflow).toBe("auto");
    expect(root.style.scrollbarGutter).toBe("");
  });

  it("does nothing when locked is false", () => {
    root.style.overflow = "auto";
    renderHook(() => useLockBodyScroll(false));
    expect(root.style.overflow).toBe("auto");
  });

  it("keeps scroll locked until the last nested lock is released", () => {
    root.style.overflow = "auto";
    const first = renderHook(() => useLockBodyScroll(true));
    const second = renderHook(() => useLockBodyScroll(true));

    first.unmount();
    expect(root.style.overflow).toBe("hidden");

    second.unmount();
    expect(root.style.overflow).toBe("auto");
  });
});
