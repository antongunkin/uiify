import type { ComponentPropsWithRef, ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

type CandleChartPartSlotProps<
  TTag extends ElementType,
  TOwned extends object = { readonly "data-part"?: never },
> = Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML" | keyof TOwned> &
  ConsumerDataAttributes &
  TOwned;

type CandleChartIndexedSlotProps<TProps extends object, TOwned extends object = object> = Omit<
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

type CandleChartRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = { readonly "data-part"?: never },
> = CandleChartIndexedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned
>;

type CandleChartCandleElementProps = HTMLAttributes<HTMLElement> & {
  readonly ref?: Ref<HTMLElement>;
};

type CandleChartCandleOwnedProps = {
  readonly "aria-hidden"?: never;
  readonly "data-crosshair-active"?: never;
  readonly "data-direction"?: never;
  readonly "data-part"?: never;
  readonly "data-time"?: never;
};

type CandleChartLiveRowOwnedProps = {
  readonly "aria-posinset"?: never;
  readonly "aria-setsize"?: never;
  readonly "data-dynamic-row"?: never;
  readonly "data-part"?: never;
  readonly "data-row-index"?: never;
  readonly role?: never;
};

type CandleChartLiveRowSlotProps = Omit<CandleChartRepeatedSlotProps<"div">, "byItemIndex"> &
  CandleChartLiveRowOwnedProps & {
    readonly byItemIndex?: Readonly<
      Record<
        number,
        Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML"> &
          ConsumerDataAttributes &
          CandleChartLiveRowOwnedProps
      >
    >;
  };

export interface CandleChartSlotProps {
  readonly caption?: CandleChartPartSlotProps<"figcaption">;
  readonly readout?: CandleChartPartSlotProps<
    "div",
    { readonly "aria-live"?: never; readonly "data-part"?: never }
  >;
  readonly readoutTime?: CandleChartPartSlotProps<"span">;
  readonly readoutOpen?: CandleChartPartSlotProps<"span">;
  readonly readoutHigh?: CandleChartPartSlotProps<"span">;
  readonly readoutLow?: CandleChartPartSlotProps<"span">;
  readonly readoutClose?: CandleChartPartSlotProps<"span">;
  readonly plot?: CandleChartPartSlotProps<
    "div",
    { readonly "aria-hidden"?: never; readonly "data-part"?: never }
  >;
  readonly scrollViewport?: CandleChartPartSlotProps<"div">;
  readonly canvas?: CandleChartPartSlotProps<"div">;
  readonly viewport?: CandleChartPartSlotProps<"div">;
  readonly candles?: CandleChartPartSlotProps<
    "ol",
    { readonly "aria-label"?: never; readonly "data-part"?: never }
  >;
  readonly candle?: CandleChartIndexedSlotProps<
    CandleChartCandleElementProps,
    CandleChartCandleOwnedProps
  >;
  readonly candleHit?: CandleChartRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly "aria-pressed"?: never;
      readonly "data-part"?: never;
      readonly type?: never;
    }
  >;
  readonly crosshair?: CandleChartPartSlotProps<
    "div",
    { readonly "aria-hidden"?: never; readonly "data-part"?: never }
  >;
  readonly crosshairMarker?: CandleChartPartSlotProps<"span">;
  readonly timeViewport?: CandleChartPartSlotProps<"div">;
  readonly timeAxis?: CandleChartPartSlotProps<
    "ol",
    { readonly "aria-label"?: never; readonly "data-axis"?: never; readonly "data-part"?: never }
  >;
  readonly timeAxisLabel?: CandleChartRepeatedSlotProps<"li">;
  readonly crosshairTime?: CandleChartPartSlotProps<"li">;
  readonly priceAxis?: CandleChartPartSlotProps<
    "ol",
    { readonly "aria-label"?: never; readonly "data-axis"?: never; readonly "data-part"?: never }
  >;
  readonly priceAxisLabel?: CandleChartRepeatedSlotProps<"li">;
  readonly crosshairPrice?: CandleChartPartSlotProps<"li">;
  readonly liveScrollport?: CandleChartPartSlotProps<
    "div",
    {
      readonly "data-dynamic-layout"?: never;
      readonly "data-orientation"?: never;
      readonly "data-part"?: never;
      readonly "data-uiify-virtual-scroll"?: never;
      readonly role?: never;
    }
  >;
  readonly liveSpacer?: CandleChartPartSlotProps<"div">;
  readonly liveCandleRow?: CandleChartLiveRowSlotProps;
  readonly dataTable?: CandleChartPartSlotProps<
    "table",
    { readonly "aria-label"?: never; readonly "data-part"?: never }
  >;
  readonly dataTableHead?: CandleChartPartSlotProps<"thead">;
  readonly dataTableHeaderRow?: CandleChartPartSlotProps<"tr">;
  readonly dataTableTimeHeader?: CandleChartPartSlotProps<
    "th",
    { readonly scope?: never; readonly "data-part"?: never }
  >;
  readonly dataTableOpenHeader?: CandleChartPartSlotProps<
    "th",
    { readonly scope?: never; readonly "data-part"?: never }
  >;
  readonly dataTableHighHeader?: CandleChartPartSlotProps<
    "th",
    { readonly scope?: never; readonly "data-part"?: never }
  >;
  readonly dataTableLowHeader?: CandleChartPartSlotProps<
    "th",
    { readonly scope?: never; readonly "data-part"?: never }
  >;
  readonly dataTableCloseHeader?: CandleChartPartSlotProps<
    "th",
    { readonly scope?: never; readonly "data-part"?: never }
  >;
  readonly dataTableBody?: CandleChartPartSlotProps<"tbody">;
  readonly dataTableRow?: CandleChartRepeatedSlotProps<"tr">;
  readonly dataTableTimeCell?: CandleChartRepeatedSlotProps<"th", { readonly scope?: never }>;
  readonly dataTableOpenCell?: CandleChartRepeatedSlotProps<"td">;
  readonly dataTableHighCell?: CandleChartRepeatedSlotProps<"td">;
  readonly dataTableLowCell?: CandleChartRepeatedSlotProps<"td">;
  readonly dataTableCloseCell?: CandleChartRepeatedSlotProps<"td">;
}

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
  readonly labels?: Partial<CandleChartLabels>;
  readonly activeCandleIndex?: number;
  readonly cursorY?: number;
  readonly data: readonly CandleChartData[];
  readonly interactive?: boolean;
  /** BCP 47 locale for default axis labels. Defaults to `"en-US"`. */
  readonly locale?: string;
  readonly onCandleClick?: (index: number) => void;
  readonly onCandlePointerLeave?: () => void;
  readonly onCandlePointerMove?: (position: CandleChartPointerPosition) => void;
  readonly selectedCandleIndex?: number;
  readonly slotProps?: CandleChartSlotProps;
  readonly xAxis?: readonly CandleChartAxisLabel[];
  readonly yAxis?: readonly CandleChartAxisLabel[];
}

export interface CandleChartLabels {
  readonly chart: string;
  readonly candle: string;
  readonly candles: string;
  readonly months: string;
  readonly prices: string;
  readonly data: string;
  readonly time: string;
  readonly open: string;
  readonly high: string;
  readonly low: string;
  readonly close: string;
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
  readonly hitLabel: string;
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
  readonly slotProps?: Pick<CandleChartSlotProps, "candle" | "candleHit"> | undefined;
}
