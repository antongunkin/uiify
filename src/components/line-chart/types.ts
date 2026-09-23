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

export interface LineChartClientOwnProps extends LineChartOwnProps {
  /**
   * Live mode: sizes point slots so `visibleCount` fill the viewport and
   * virtualizes the full history with a horizontal VirtualScroll. The chart
   * follows new points while the reader is at the newest one; the value scale,
   * axes, readout, and data table follow the visible points. Zoom is disabled.
   */
  readonly visibleCount?: number;
}

export type LineChartClientProps<TAs extends ElementType = "figure"> = RenderableProps<
  TAs,
  LineChartClientOwnProps,
  Record<string, never>,
  HTMLElement
>;

/** Internal props the client entry passes to `LineChart`; not part of the public API. */
export interface LineChartViewProps extends LineChartOwnProps {
  /** Replaces the static point list (e.g. with a virtualized layer). */
  readonly pointLayer?: ReactNode;
  /** Announce readout changes; off for streaming data. Defaults to `true`. */
  readonly announceReadout?: boolean;
  /**
   * Point slots across the content. When set, the crosshair sits at slot
   * centers — `(slotOffset + index + 0.5) / slotCount` — instead of spreading
   * `data` edge to edge.
   */
  readonly slotCount?: number;
  /** Slot of `data[0]` when `data` is a slice. Defaults to `0`. */
  readonly slotOffset?: number;
}

export interface LineChartPointProps {
  readonly as: "div" | "li";
  readonly point: LineChartData;
  readonly previousPoint: LineChartData | undefined;
  /** Index reported to the pointer and click callbacks, and used for x in the static list. */
  readonly index: number;
  readonly count: number;
  readonly min: number;
  readonly max: number;
  readonly interactive: boolean;
  readonly isActive: boolean;
  readonly isSelected: boolean;
  readonly cursorY?: number | undefined;
  readonly onPointClick?: ((index: number) => void) | undefined;
  readonly onPointPointerLeave?: (() => void) | undefined;
  readonly onPointPointerMove?: ((position: LineChartPointerPosition) => void) | undefined;
}
