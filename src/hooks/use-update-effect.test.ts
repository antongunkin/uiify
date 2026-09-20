import { createElement, StrictMode } from "react";
import type { PropsWithChildren } from "react";
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUpdateEffect } from "./use-update-effect.js";

describe("useUpdateEffect", () => {
  it("skips the mount run and fires on dependency change", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(({ dep }: { dep: number }) => useUpdateEffect(fn, [dep]), {
      initialProps: { dep: 0 },
    });
    expect(fn).not.toHaveBeenCalled();
    rerender({ dep: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("still skips the mount effect under StrictMode", () => {
    const fn = vi.fn();
    const wrapper = ({ children }: PropsWithChildren) => createElement(StrictMode, null, children);
    wrapper.displayName = "wrapper";
    const { rerender } = renderHook(({ dep }: { dep: number }) => useUpdateEffect(fn, [dep]), {
      initialProps: { dep: 0 },
      wrapper,
    });

    expect(fn).not.toHaveBeenCalled();
    rerender({ dep: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
