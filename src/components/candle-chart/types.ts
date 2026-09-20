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
