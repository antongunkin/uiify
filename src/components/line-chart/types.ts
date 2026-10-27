import type { ComponentPropsWithRef, ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

type LineChartPartSlotProps<
  TTag extends ElementType,
  TOwned extends object = { readonly "data-part"?: never },
> = Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML" | keyof TOwned> &
  ConsumerDataAttributes &
  TOwned;

type LineChartIndexedSlotProps<TProps extends object, TOwned extends object = object> = Omit<
  TProps,
  "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes &
  TOwned & {
    readonly byItemIndex?: Readonly<
      Record<
        number,
        Omit<TProps, "children" | "dangerouslySetInnerHTML"> & ConsumerDataAttributes & TOwned
      >
    >;
  };

type LineChartRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = { readonly "data-part"?: never },
> = LineChartIndexedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned
>;

type LineChartPointElementProps = HTMLAttributes<HTMLElement> & { readonly ref?: Ref<HTMLElement> };

type LineChartPointOwnedProps = {
  readonly "aria-hidden"?: never;
  readonly "data-crosshair-active"?: never;
  readonly "data-first"?: never;
  readonly "data-part"?: never;
  readonly "data-point-selected"?: never;
  readonly "data-time"?: never;
  readonly "data-trend"?: never;
};

type LineChartLiveRowOwnedProps = {
  readonly "aria-posinset"?: never;
  readonly "aria-setsize"?: never;
  readonly "data-dynamic-row"?: never;
  readonly "data-part"?: never;
  readonly "data-row-index"?: never;
  readonly role?: never;
};

type LineChartLiveRowSlotProps = Omit<LineChartRepeatedSlotProps<"div">, "byItemIndex"> &
  LineChartLiveRowOwnedProps & {
    readonly byItemIndex?: Readonly<
      Record<
        number,
        Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML"> &
          ConsumerDataAttributes &
          LineChartLiveRowOwnedProps
      >
    >;
  };

export interface LineChartSlotProps {
  readonly caption?: LineChartPartSlotProps<"figcaption">;
  readonly readout?: LineChartPartSlotProps<
    "div",
    {
      readonly "aria-live"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly readoutTime?: LineChartPartSlotProps<"span">;
  readonly readoutValue?: LineChartPartSlotProps<"span">;
  readonly plot?: LineChartPartSlotProps<
    "div",
    {
      readonly "aria-hidden"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly scrollViewport?: LineChartPartSlotProps<"div">;
  readonly canvas?: LineChartPartSlotProps<"div">;
  readonly viewport?: LineChartPartSlotProps<"div">;
  readonly points?: LineChartPartSlotProps<
    "ol",
    {
      readonly "aria-label"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly point?: LineChartIndexedSlotProps<LineChartPointElementProps, LineChartPointOwnedProps>;
  readonly pointHit?: LineChartRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly "aria-pressed"?: never;
      readonly "data-part"?: never;
      readonly type?: never;
    }
  >;
  readonly crosshair?: LineChartPartSlotProps<
    "div",
    {
      readonly "aria-hidden"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly crosshairMarker?: LineChartPartSlotProps<"span">;
  readonly timeViewport?: LineChartPartSlotProps<"div">;
  readonly timeAxis?: LineChartPartSlotProps<
    "ol",
    {
      readonly "aria-label"?: never;
      readonly "data-axis"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly timeAxisLabel?: LineChartRepeatedSlotProps<"li">;
  readonly crosshairTime?: LineChartPartSlotProps<"li">;
  readonly valueAxis?: LineChartPartSlotProps<
    "ol",
    {
      readonly "aria-label"?: never;
      readonly "data-axis"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly valueAxisLabel?: LineChartRepeatedSlotProps<"li">;
  readonly crosshairValue?: LineChartPartSlotProps<"li">;
  readonly liveScrollport?: LineChartPartSlotProps<
    "div",
    {
      readonly "data-dynamic-layout"?: never;
      readonly "data-orientation"?: never;
      readonly "data-part"?: never;
      readonly "data-uiify-virtual-scroll"?: never;
      readonly role?: never;
    }
  >;
  readonly liveSpacer?: LineChartPartSlotProps<"div">;
  readonly livePointRow?: LineChartLiveRowSlotProps;
  readonly dataTable?: LineChartPartSlotProps<
    "table",
    {
      readonly "aria-label"?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly dataTableHead?: LineChartPartSlotProps<"thead">;
  readonly dataTableHeaderRow?: LineChartPartSlotProps<"tr">;
  readonly dataTableTimeHeader?: LineChartPartSlotProps<
    "th",
    {
      readonly scope?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly dataTableValueHeader?: LineChartPartSlotProps<
    "th",
    {
      readonly scope?: never;
      readonly "data-part"?: never;
    }
  >;
  readonly dataTableBody?: LineChartPartSlotProps<"tbody">;
  readonly dataTableRow?: LineChartRepeatedSlotProps<"tr">;
  readonly dataTableTimeCell?: LineChartRepeatedSlotProps<"th", { readonly scope?: never }>;
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
  readonly "aria-label"?: string;
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
