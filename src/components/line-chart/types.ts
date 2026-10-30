import type { ElementType, DOMAttributes, ReactNode, Ref } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { SlotProps } from "../../core/slot-props.js";

type LineChartIndexedSlotProps<TProps extends object> = TProps & {
  readonly byItemIndex?: Readonly<Record<number, TProps>>;
};

type LineChartRepeatedSlotProps<TTag extends ElementType> = LineChartIndexedSlotProps<
  SlotProps<TTag>
>;

type LineChartPointElementProps = Omit<SlotProps<"div">, keyof DOMAttributes<HTMLElement> | "ref"> &
  Omit<DOMAttributes<HTMLElement>, "children" | "dangerouslySetInnerHTML"> & {
    readonly ref?: Ref<HTMLElement> | undefined;
  };

export interface LineChartSlotProps {
  readonly caption?: SlotProps<"figcaption">;
  readonly readout?: SlotProps<"div">;
  readonly readoutTime?: SlotProps<"span">;
  readonly readoutValue?: SlotProps<"span">;
  readonly plot?: SlotProps<"div">;
  readonly scrollViewport?: SlotProps<"div">;
  readonly canvas?: SlotProps<"div">;
  readonly viewport?: SlotProps<"div">;
  readonly points?: SlotProps<"ol">;
  readonly point?: LineChartIndexedSlotProps<LineChartPointElementProps>;
  readonly pointHit?: LineChartRepeatedSlotProps<"button">;
  readonly crosshair?: SlotProps<"div">;
  readonly crosshairMarker?: SlotProps<"span">;
  readonly timeViewport?: SlotProps<"div">;
  readonly timeAxis?: SlotProps<"ol">;
  readonly timeAxisLabel?: LineChartRepeatedSlotProps<"li">;
  readonly crosshairTime?: SlotProps<"li">;
  readonly valueAxis?: SlotProps<"ol">;
  readonly valueAxisLabel?: LineChartRepeatedSlotProps<"li">;
  readonly crosshairValue?: SlotProps<"li">;
  readonly liveScrollport?: SlotProps<"div">;
  readonly liveSpacer?: SlotProps<"div">;
  readonly livePointRow?: LineChartRepeatedSlotProps<"div">;
  readonly dataTable?: SlotProps<"table">;
  readonly dataTableHead?: SlotProps<"thead">;
  readonly dataTableHeaderRow?: SlotProps<"tr">;
  readonly dataTableTimeHeader?: SlotProps<"th">;
  readonly dataTableValueHeader?: SlotProps<"th">;
  readonly dataTableBody?: SlotProps<"tbody">;
  readonly dataTableRow?: LineChartRepeatedSlotProps<"tr">;
  readonly dataTableTimeCell?: LineChartRepeatedSlotProps<"th">;
  readonly dataTableValueCell?: LineChartRepeatedSlotProps<"td">;
}

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
  readonly "aria-label"?: string | undefined;
  readonly activePointIndex?: number;
  readonly cursorY?: number;
  readonly data: readonly LineChartData[];
  readonly interactive?: boolean;
  /** BCP 47 locale for default axis labels. Defaults to `"en-US"`. */
  readonly locale?: string;
  readonly onPointClick?: (index: number) => void;
  readonly onPointPointerLeave?: () => void;
  readonly onPointPointerMove?: (position: LineChartPointerPosition) => void;
  readonly selectedPointIndex?: number;
  readonly slotProps?: LineChartSlotProps;
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
  readonly slotProps?: Pick<LineChartSlotProps, "point" | "pointHit"> | undefined;
}
