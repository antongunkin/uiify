"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

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
  consumerStyle?: CSSProperties | undefined,
): void {
  const consumerStyleRef = useRef(consumerStyle);
  consumerStyleRef.current = consumerStyle;
  useEffect(() => {
    const chart = chartRef.current;
    const scroller = chart?.querySelector<HTMLElement>('[data-part="scroll-viewport"]');
    if (!chart || !scroller || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const border = entry?.borderBoxSize[0]?.blockSize;
      const content = entry?.contentBoxSize[0]?.blockSize;
      if (border === undefined || content === undefined) return;
      // The scroll viewport has no padding or border, so the difference is the scrollbar.
      const style: CSSProperties & Record<`--${string}`, string | number | undefined> = {
        [variable]: `${Math.max(0, border - content)}px`,
        ...consumerStyleRef.current,
      };
      const value = style[variable];
      if (value === undefined) chart.style.removeProperty(variable);
      else chart.style.setProperty(variable, String(value));
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [chartRef, variable]);
}
