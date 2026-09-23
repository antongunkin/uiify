import type { ReactNode, RefObject } from "react";
import type { VirtualScrollHandle, VirtualScrollRangeChange } from "../../virtual-scroll/types.js";

export interface LiveChartAxisLabel {
  readonly label: ReactNode;
  /** Position across the whole scrolled content, as a percentage from 0 to 100. */
  readonly position: number;
}

export interface UseLiveChartWindowOptions {
  /** Total number of items (candles or points) in the chart. */
  readonly count: number;
  /** Items that fill the viewport; `undefined` or `0` turns live mode off. */
  readonly visibleCount: number | undefined;
  /** Measured width of one item slot, in CSS pixels. */
  readonly itemWidth: number;
  /** Measured content height of the chart `<figure>`, once known. */
  readonly figureHeight: number | undefined;
  /** Custom property that receives the scroll offset, e.g. `--candle-scroll-x`. */
  readonly scrollVariable: `--${string}`;
}

export interface UseLiveChartWindowResult {
  readonly live: boolean;
  /** Pass to the chart's VirtualScroll `scrollRef`. */
  readonly scrollRef: RefObject<VirtualScrollHandle | null>;
  /** Merge into the chart `<figure>` ref; the scroll offset variable is written there. */
  readonly chartRef: RefObject<HTMLElement | null>;
  /** Pass to the chart's VirtualScroll `onRangeChange`. */
  readonly onRangeChange: (range: VirtualScrollRangeChange) => void;
  /** Visible slice `[sliceStart, sliceEnd)` that drives the scale, readout, and table. */
  readonly sliceStart: number;
  readonly sliceEnd: number;
  /** Width of all item slots, in CSS pixels. */
  readonly contentSize: number;
  /** Block size of the item viewport, in CSS pixels. */
  readonly plotHeight: number;
}
