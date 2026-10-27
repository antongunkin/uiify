import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

/** Fixed row height — default for scroll math when `estimateRowHeight` is omitted. */
export const VIRTUAL_SCROLL_ROW_HEIGHT = 64;

/** Overscan rows above and below the viewport to avoid flicker during fast scroll. */
export const VIRTUAL_SCROLL_OVERSCAN = 5;

/** Default delay before treating scroll as settled when `scrollend` is unavailable. */
export const VIRTUAL_SCROLL_SCROLL_RESET_DELAY = 150;

/** Distance from list bottom treated as "pinned to end" for anchor/follow. */
export const VIRTUAL_SCROLL_ANCHOR_THRESHOLD = 1;

export interface VirtualScrollItem {
  readonly id: string;
}

type VirtualScrollRowOwnedProps = {
  readonly "aria-posinset"?: never;
  readonly "aria-setsize"?: never;
  readonly "data-dynamic-row"?: never;
  readonly "data-part"?: never;
  readonly "data-row-index"?: never;
  readonly role?: never;
};

type VirtualScrollRowNativeProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
>;

export type VirtualScrollRowSlotProps = RepeatedSlotProps<
  VirtualScrollRowNativeProps,
  VirtualScrollRowOwnedProps
> & {
  readonly byItemIndex?: Readonly<
    Record<
      number,
      VirtualScrollRowNativeProps & ConsumerDataAttributes & VirtualScrollRowOwnedProps
    >
  >;
};

export type VirtualScrollSpacerSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML" | "data-part"
> & {
  readonly "data-part"?: never;
} & ConsumerDataAttributes;

export interface VirtualScrollSlotProps {
  readonly row?: VirtualScrollRowSlotProps;
  readonly spacer?: VirtualScrollSpacerSlotProps;
}

export type VirtualScrollListRole = "list" | "grid";

export type VirtualScrollAnchor = "start" | "end";

/** Scroll axis. Row size props (`rowHeight`, `estimateRowHeight`) measure along this axis. */
export type VirtualScrollOrientation = "vertical" | "horizontal";

export type VirtualScrollScrollAlign = "start" | "center" | "end" | "auto";

export type VirtualScrollScrollBehavior = "auto" | "instant" | "smooth";

export interface VirtualScrollScrollBehaviorOptions {
  readonly behavior?: VirtualScrollScrollBehavior;
}

export interface VirtualScrollScrollToIndexOptions extends VirtualScrollScrollBehaviorOptions {
  readonly align?: VirtualScrollScrollAlign;
}

export interface VirtualScrollRangeChange {
  /** First visible row index (no overscan). */
  readonly startIndex: number;
  /** Last visible row index, inclusive (no overscan). */
  readonly endIndex: number;
  /** First rendered row index including overscan. */
  readonly overscanStart: number;
  /** Last rendered row index, inclusive, including overscan. */
  readonly overscanEnd: number;
}

export interface VirtualScrollScrollState {
  readonly isScrolling: boolean;
}

export interface VirtualScrollHandle {
  readonly element: HTMLDivElement | null;
  scrollToIndex(index: number, options?: VirtualScrollScrollToIndexOptions): void;
  scrollToOffset(offset: number, options?: VirtualScrollScrollBehaviorOptions): void;
  scrollToEnd(options?: VirtualScrollScrollBehaviorOptions): void;
}

export interface VirtualScrollOwnProps<T extends VirtualScrollItem> extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "role"
> {
  readonly ref?: Ref<HTMLDivElement>;
  readonly items: readonly T[];
  /** Scrollport height; also the viewport extent used before the first resize measurement. */
  readonly height?: number;
  /** Fixed item size along the scroll axis — row height when vertical, item width when horizontal. */
  readonly rowHeight?: number;
  readonly orientation?: VirtualScrollOrientation;
  readonly overscan?: number;
  readonly className?: string | undefined;
  readonly testId?: string;
  readonly renderRow: (item: T, index: number) => ReactNode;
  readonly scrollRef?: Ref<VirtualScrollHandle>;
  readonly estimateRowHeight?: (index: number) => number;
  readonly onRangeChange?: (range: VirtualScrollRangeChange) => void;
  readonly role?: VirtualScrollListRole;
  readonly anchor?: VirtualScrollAnchor;
  readonly followAppend?: boolean | "smooth";
  readonly onScrollStateChange?: (state: VirtualScrollScrollState) => void;
  readonly isScrollingResetDelay?: number;
  readonly slotProps?: VirtualScrollSlotProps;
}

export interface VirtualScrollRowShellProps extends Omit<
  ComponentPropsWithRef<"div">,
  | "aria-posinset"
  | "aria-setsize"
  | "children"
  | "data-dynamic-row"
  | "data-part"
  | "data-row-index"
  | "dangerouslySetInnerHTML"
  | "role"
> {
  readonly children: ReactNode;
  readonly dynamicLayout: boolean;
  readonly index: number;
  readonly itemCount: number;
  readonly listRole: VirtualScrollListRole;
  readonly rowOffset?: number;
  readonly rowHeight?: number;
  readonly slotIndex: number;
}

export interface VirtualScrollRowSlot<T extends VirtualScrollItem> {
  readonly slotIndex: number;
  readonly index: number;
  readonly item: T | null;
}
