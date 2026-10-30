import type { ElementType, DOMAttributes, ReactNode, Ref } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { SlotProps } from "../../core/slot-props.js";

type CandleChartIndexedSlotProps<TProps extends object> = TProps & {
  readonly byItemIndex?: Readonly<Record<number, TProps>>;
};

type CandleChartRepeatedSlotProps<TTag extends ElementType> = CandleChartIndexedSlotProps<
  SlotProps<TTag>
>;

type CandleChartCandleElementProps = Omit<
  SlotProps<"div">,
  keyof DOMAttributes<HTMLElement> | "ref"
> &
  Omit<DOMAttributes<HTMLElement>, "children" | "dangerouslySetInnerHTML"> & {
    readonly ref?: Ref<HTMLElement> | undefined;
  };

export interface CandleChartSlotProps {
  readonly caption?: SlotProps<"figcaption">;
  readonly readout?: SlotProps<"div">;
  readonly readoutTime?: SlotProps<"span">;
  readonly readoutOpen?: SlotProps<"span">;
  readonly readoutHigh?: SlotProps<"span">;
  readonly readoutLow?: SlotProps<"span">;
  readonly readoutClose?: SlotProps<"span">;
  readonly plot?: SlotProps<"div">;
  readonly scrollViewport?: SlotProps<"div">;
  readonly canvas?: SlotProps<"div">;
  readonly viewport?: SlotProps<"div">;
  readonly candles?: SlotProps<"ol">;
  readonly candle?: CandleChartIndexedSlotProps<CandleChartCandleElementProps>;
  readonly candleHit?: CandleChartRepeatedSlotProps<"button">;
  readonly crosshair?: SlotProps<"div">;
  readonly crosshairMarker?: SlotProps<"span">;
  readonly timeViewport?: SlotProps<"div">;
  readonly timeAxis?: SlotProps<"ol">;
  readonly timeAxisLabel?: CandleChartRepeatedSlotProps<"li">;
  readonly crosshairTime?: SlotProps<"li">;
  readonly priceAxis?: SlotProps<"ol">;
  readonly priceAxisLabel?: CandleChartRepeatedSlotProps<"li">;
  readonly crosshairPrice?: SlotProps<"li">;
  readonly liveScrollport?: SlotProps<"div">;
  readonly liveSpacer?: SlotProps<"div">;
  readonly liveCandleRow?: CandleChartRepeatedSlotProps<"div">;
  readonly dataTable?: SlotProps<"table">;
  readonly dataTableHead?: SlotProps<"thead">;
  readonly dataTableHeaderRow?: SlotProps<"tr">;
  readonly dataTableTimeHeader?: SlotProps<"th">;
  readonly dataTableOpenHeader?: SlotProps<"th">;
  readonly dataTableHighHeader?: SlotProps<"th">;
  readonly dataTableLowHeader?: SlotProps<"th">;
  readonly dataTableCloseHeader?: SlotProps<"th">;
  readonly dataTableBody?: SlotProps<"tbody">;
  readonly dataTableRow?: CandleChartRepeatedSlotProps<"tr">;
  readonly dataTableTimeCell?: CandleChartRepeatedSlotProps<"th">;
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
  readonly "aria-label"?: string | undefined;
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
