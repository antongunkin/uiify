"use client";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "../../../hooks/use-isomorphic-layout-effect.js";
import type { VirtualScrollHandle, VirtualScrollRangeChange } from "../../virtual-scroll/types.js";
import type {
  LiveChartAxisLabel,
  UseLiveChartWindowOptions,
  UseLiveChartWindowResult,
} from "./types.js";

/** The plot's 1.5rem time-axis row below the item viewport (candle-chart.css, line-chart.css). */
const TIME_AXIS_ROW_HEIGHT = 24;
/** The item viewport's 18rem minimum block size, used until the figure is measured. */
const MIN_PLOT_HEIGHT = 288;
const LIVE_TIME_TICKS = 4;

/**
 * Time ticks pinned to absolute item indices and positioned at slot centers
 * across the whole scrolled content, so labels scroll with their items. Only
 * ticks near the visible slice are returned.
 */
export function liveTimeAxis(
  data: readonly { readonly time: string | number }[],
  start: number,
  end: number,
  visibleCount: number,
): LiveChartAxisLabel[] {
  const step = Math.max(1, Math.ceil(visibleCount / LIVE_TIME_TICKS));
  const labels: LiveChartAxisLabel[] = [];
  const first = Math.max(0, Math.floor(start / step) - 1) * step;
  const last = Math.min(data.length, end + step);
  for (let index = first; index < last; index += step) {
    labels.push({
      label: String(data[index]?.time),
      position: ((index + 0.5) / data.length) * 100,
    });
  }
  return labels;
}

/**
 * Live chart window over a horizontal VirtualScroll: follows appends while the
 * reader is at the newest item, leaves a scrolled-back reader in place, and
 * reports the visible slice. The chart pins the scroll position itself rather
 * than using VirtualScroll's `anchor`, and publishes the offset as a CSS
 * variable so axes and crosshairs scroll without re-rendering.
 */
export function useLiveChartWindow(options: UseLiveChartWindowOptions): UseLiveChartWindowResult {
  const { count, visibleCount = 0, itemWidth, figureHeight, scrollVariable } = options;
  const live = visibleCount > 0;
  const scrollRef = useRef<VirtualScrollHandle>(null);
  const chartRef = useRef<HTMLElement | null>(null);
  const [visibleRange, setVisibleRange] = useState<VirtualScrollRangeChange | null>(null);
  // True while the reader sits at the newest item; appends then keep it in view.
  const [following, setFollowing] = useState(true);
  const contentSize = count * itemWidth;
  const viewportWidth = itemWidth * visibleCount;
  const layoutRef = useRef({ contentSize, itemWidth, viewportWidth });
  layoutRef.current = { contentSize, itemWidth, viewportWidth };

  // Publish the scroll offset (a CSS variable, so scrolling re-renders nothing)
  // and track whether the reader is at the end.
  useEffect(() => {
    if (!live) return;
    const element = scrollRef.current?.element;
    const chart = chartRef.current;
    if (!element || !chart) return;
    const onScroll = (): void => {
      const offset = element.scrollLeft; // banned-read-ok: scroll position drives the axis offset.
      chart.style.setProperty(scrollVariable, `${offset}px`);
      const layout = layoutRef.current;
      // Within one item of the end counts: an item appended while the reader
      // scrolls there moves the end by exactly one item width.
      setFollowing(
        offset + layout.viewportWidth >= layout.contentSize - Math.max(1, layout.itemWidth),
      );
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [live, scrollVariable]);

  // Keep the newest item in view while following: on appends, resizes, and once measured.
  useIsomorphicLayoutEffect(() => {
    if (!live || !following) return;
    const element = scrollRef.current?.element;
    const chart = chartRef.current;
    if (!element || !chart) return;
    const end = Math.max(0, contentSize - viewportWidth);
    element.scrollLeft = end; // banned-read-ok: pin the newest item before paint.
    chart.style.setProperty(scrollVariable, `${end}px`);
  }, [live, following, contentSize, viewportWidth, scrollVariable]);

  // While following, the slice is the tail, so an append rescales in the same
  // commit that adds the item.
  const tail = following || !visibleRange;
  const sliceStart = tail
    ? Math.max(0, count - visibleCount)
    : Math.min(visibleRange.startIndex, Math.max(0, count - 1));
  const sliceEnd = tail
    ? count
    : Math.min(count, Math.max(sliceStart + 1, visibleRange.endIndex + 1));
  const plotHeight =
    figureHeight === undefined
      ? MIN_PLOT_HEIGHT
      : Math.max(MIN_PLOT_HEIGHT, figureHeight - TIME_AXIS_ROW_HEIGHT);

  return {
    live,
    scrollRef,
    chartRef,
    onRangeChange: setVisibleRange,
    sliceStart,
    sliceEnd,
    contentSize,
    plotHeight,
  };
}
