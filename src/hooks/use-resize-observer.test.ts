import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRef } from "react";
import { useResizeObserver } from "./use-resize-observer.js";

describe("useResizeObserver", () => {
  let trigger: ((entries: Array<{ contentRect: DOMRectReadOnly }>) => void) | null = null;

  beforeEach(() => {
    trigger = null;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: (entries: Array<{ contentRect: DOMRectReadOnly }>) => void) {
          trigger = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  it("reports size updates from the observer", () => {
    const element = document.createElement("div");
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      ref.current = element;
      return useResizeObserver(ref);
    });
    expect(result.current).toBeUndefined();
    act(() => {
      trigger?.([{ contentRect: { width: 120, height: 40 } as DOMRectReadOnly }]);
    });
    expect(result.current).toEqual({ width: 120, height: 40 });

    const firstSize = result.current;
    act(() => {
      trigger?.([{ contentRect: { width: 120, height: 40 } as DOMRectReadOnly }]);
    });
    expect(result.current).toBe(firstSize);
  });
});
