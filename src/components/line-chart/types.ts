import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface LineChartData {
  readonly time: string | number;
  readonly value: number;
}

export interface LineChartAxisLabel {
  readonly label: ReactNode;
  /** Position on the axis as a percentage from 0 to 100. */
  readonly position: number;
}

export interface LineChartPointerPosition {
  readonly index: number;
  /** Pointer offset inside the point hit area, in CSS pixels. */
  readonly offsetY: number;
}

export interface LineChartOwnProps {
  readonly "aria-label"?: string;
  readonly activePointIndex?: number;
  readonly cursorY?: number;
  readonly data: readonly LineChartData[];
  readonly interactive?: boolean;
  readonly onPointClick?: (index: number) => void;
  readonly onPointPointerLeave?: () => void;
  readonly onPointPointerMove?: (position: LineChartPointerPosition) => void;
  readonly selectedPointIndex?: number;
  readonly xAxis?: readonly LineChartAxisLabel[];
  readonly yAxis?: readonly LineChartAxisLabel[];
}

export type LineChartProps<TAs extends ElementType = "figure"> = RenderableProps<
  TAs,
  LineChartOwnProps,
  Record<string, never>,
  HTMLElement
>;
