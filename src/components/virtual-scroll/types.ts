import type { ReactNode, Ref } from "react";

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

export type VirtualScrollListRole = "list" | "grid";

export type VirtualScrollAnchor = "start" | "end";

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

export interface VirtualScrollOwnProps<T extends VirtualScrollItem> {
  readonly items: readonly T[];
  readonly height?: number;
  readonly rowHeight?: number;
  readonly overscan?: number;
  readonly className?: string;
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
}

export interface VirtualScrollRowSlot<T extends VirtualScrollItem> {
  readonly slotIndex: number;
  readonly index: number;
  readonly item: T | null;
}
