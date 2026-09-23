"use client";

import { useEffect, type RefObject } from "react";

/**
 * Publishes the horizontal scrollbar thickness of a chart's
 * `[data-part="scroll-viewport"]` as `variable` on the chart element, so the
 * plot grid can reserve that height below the time axis. A classic scrollbar
 * otherwise takes its height from the scroll viewport, and the flexible
 * candle row absorbs it, misaligning the value axis. Overlay scrollbars
 * measure 0. Read from ResizeObserver box sizes: no forced layout.
 */
export function useScrollbarReserve(
  chartRef: RefObject<HTMLElement | null>,
  variable: `--${string}`,
): void {
  useEffect(() => {
    const chart = chartRef.current;
    const scroller = chart?.querySelector<HTMLElement>('[data-part="scroll-viewport"]');
    if (!chart || !scroller || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const border = entry?.borderBoxSize[0]?.blockSize;
      const content = entry?.contentBoxSize[0]?.blockSize;
      if (border === undefined || content === undefined) return;
      // The scroll viewport has no padding or border, so the difference is the scrollbar.
      chart.style.setProperty(variable, `${Math.max(0, border - content)}px`);
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [chartRef, variable]);
}
