import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface CandleChartData {
  readonly time: string | number;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export interface CandleChartAxisLabel {
  readonly label: ReactNode;
  /** Position on the axis as a percentage from 0 to 100. */
  readonly position: number;
}

export interface CandleChartPointerPosition {
  readonly index: number;
  /** Pointer offset inside the candle hit area, in CSS pixels. */
  readonly offsetY: number;
}

export interface CandleChartOwnProps {
  readonly "aria-label"?: string;
  readonly activeCandleIndex?: number;
  readonly cursorY?: number;
  readonly data: readonly CandleChartData[];
  readonly interactive?: boolean;
  readonly onCandleClick?: (index: number) => void;
  readonly onCandlePointerLeave?: () => void;
  readonly onCandlePointerMove?: (position: CandleChartPointerPosition) => void;
  readonly selectedCandleIndex?: number;
  readonly xAxis?: readonly CandleChartAxisLabel[];
  readonly yAxis?: readonly CandleChartAxisLabel[];
}

export type CandleChartProps<TAs extends ElementType = "figure"> = RenderableProps<
  TAs,
  CandleChartOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface CandleChartClientOwnProps extends CandleChartOwnProps {
  /**
   * Live mode: sizes candles so `visibleCount` fill the viewport and virtualizes
   * the full history with a horizontal VirtualScroll. The chart follows new
   * candles while the reader is at the newest one; the price scale, axes,
   * readout, and data table follow the visible candles. Zoom is disabled.
   */
  readonly visibleCount?: number;
}

export type CandleChartClientProps<TAs extends ElementType = "figure"> = RenderableProps<
  TAs,
  CandleChartClientOwnProps,
  Record<string, never>,
  HTMLElement
>;

/** Internal props the client entry passes to `CandleChart`; not part of the public API. */
export interface CandleChartViewProps extends CandleChartOwnProps {
  /** Replaces the static candle list (e.g. with a virtualized layer). */
  readonly candleLayer?: ReactNode;
  /** Announce readout changes; off for streaming data. Defaults to `true`. */
  readonly announceReadout?: boolean;
  /** Slots the crosshair is positioned across. Defaults to `data.length`. */
  readonly slotCount?: number;
  /** Slot of `data[0]` within those slots, when `data` is a slice. Defaults to `0`. */
  readonly slotOffset?: number;
}

export interface CandleChartCandleProps {
  readonly as: "div" | "li";
  readonly candle: CandleChartData;
  /** Index reported to the pointer and click callbacks. */
  readonly index: number;
  /** Candle position and width, as percentages of the candle layer. */
  readonly x: number;
  readonly slot: number;
  readonly min: number;
  readonly max: number;
  readonly interactive: boolean;
  readonly isActive: boolean;
  readonly isSelected: boolean;
  readonly cursorY?: number | undefined;
  readonly onCandleClick?: ((index: number) => void) | undefined;
  readonly onCandlePointerLeave?: (() => void) | undefined;
  readonly onCandlePointerMove?: ((position: CandleChartPointerPosition) => void) | undefined;
}
