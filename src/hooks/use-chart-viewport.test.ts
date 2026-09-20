import { act, renderHook } from "@testing-library/react";
import type { WheelEvent as ReactWheelEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { computeAnchoredScrollOffset, useChartViewport } from "./use-chart-viewport.js";

function wheel(deltaY: number, deltaX = 0, shiftKey = false): ReactWheelEvent<HTMLElement> {
  return {
    deltaX,
    deltaY,
    preventDefault: vi.fn(),
    shiftKey,
  } as unknown as ReactWheelEvent<HTMLElement>;
}

describe("useChartViewport", () => {
  it("keeps the anchored candle center at the same viewport offset", () => {
    expect(computeAnchoredScrollOffset(20, 10, 15, 120)).toBe(222.5);
  });

  it("starts at the right edge with the configured initial scale", () => {
    const { result } = renderHook(() => useChartViewport({ itemCount: 100 }));

    expect(result.current.scale).toBe(3.2);
    expect(result.current.ref.current).toBeNull();
  });

  it("zooms in and out while keeping the right edge pinned", () => {
    const { result } = renderHook(() => useChartViewport({ itemCount: 100 }));
    const zoomIn = wheel(-100);
    const zoomOut = wheel(100);

    act(() => result.current.onWheel(zoomIn));
    expect(result.current.scale).toBeGreaterThan(3.2);
    expect(zoomIn.preventDefault).toHaveBeenCalledOnce();

    act(() => result.current.onWheel(zoomOut));
    expect(result.current.scale).toBeCloseTo(3.2);
  });

  it("clamps to the container width and 50-percent-slot maximum zoom", () => {
    const { result } = renderHook(() => useChartViewport({ itemCount: 100, maxScale: 1000 }));
    const zoomOut = wheel(100);
    const zoomIn = wheel(-100);

    act(() => {
      for (let index = 0; index < 100; index += 1) result.current.onWheel(zoomOut);
    });
    expect(result.current.scale).toBe(1);

    act(() => {
      for (let index = 0; index < 100; index += 1) result.current.onWheel(zoomIn);
    });
    expect(result.current.scale).toBe(50);
  });

  it("does not shrink a single-item chart below its container", () => {
    const { result } = renderHook(() => useChartViewport({ itemCount: 1, maxScale: 1000 }));

    act(() => {
      for (let index = 0; index < 100; index += 1) result.current.onWheel(wheel(-100));
    });

    expect(result.current.scale).toBe(1);
  });

  it("keeps 1000 items at least 6px wide after measuring the chart", async () => {
    let notify: ResizeObserverCallback | undefined;
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe(): void {}
      disconnect(): void {}
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const target = document.createElement("figure");
    const { result, rerender } = renderHook(() =>
      useChartViewport({ itemCount: 1000, minItemWidth: 6 }),
    );

    act(() => {
      result.current.ref.current = target;
      rerender();
    });
    act(() => {
      notify?.(
        [
          {
            contentRect: { width: 600, height: 300 },
            target,
          } as unknown as ResizeObserverEntry,
        ] as unknown as ResizeObserverEntry[],
        {} as ResizeObserver,
      );
    });
    await act(async () => {});

    expect(result.current.itemWidth).toBeGreaterThanOrEqual(6);
    expect(result.current.scale).toBeGreaterThanOrEqual(10);

    act(() => result.current.onWheel(wheel(-100)));
    expect(result.current.itemWidth).toBeGreaterThan(6);

    vi.unstubAllGlobals();
  });

  it("binds the wheel listener as non-passive on its ref target", () => {
    const target = document.createElement("div");
    const addEventListener = vi.spyOn(target, "addEventListener");
    const { result, rerender } = renderHook(() => useChartViewport({ itemCount: 100 }));

    act(() => {
      result.current.ref.current = target;
      rerender();
    });

    const wheelSubscription = addEventListener.mock.calls.find(([type]) => type === "wheel");
    expect(wheelSubscription?.[2]).toEqual({ capture: false, passive: false, once: false });
  });

  it("leaves horizontal wheel movement to the native scroll container", () => {
    const { result } = renderHook(() => useChartViewport({ itemCount: 100 }));
    const horizontalWheel = wheel(0, -1000);

    act(() => result.current.onWheel(horizontalWheel));
    expect(horizontalWheel.preventDefault).not.toHaveBeenCalled();
  });

  it("does not intercept wheel events when zoom is disabled", () => {
    const { result } = renderHook(() => useChartViewport({ enabled: false, itemCount: 100 }));
    const verticalWheel = wheel(-100);

    act(() => result.current.onWheel(verticalWheel));
    expect(result.current.scale).toBe(3.2);
    expect(verticalWheel.preventDefault).not.toHaveBeenCalled();
  });
});
