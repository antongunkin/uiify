import type { VirtualScrollRangeChange } from "./types.js";

export interface VirtualScrollRange {
  readonly start: number;
  readonly end: number;
  readonly visibleStart: number;
  readonly visibleEnd: number;
  readonly offsetY: number;
}

export interface ComputeVirtualScrollRangeOptions {
  readonly scrollTop: number;
  readonly viewportHeight: number;
  readonly itemCount: number;
  readonly rowHeight: number;
  readonly overscan: number;
}

export interface ComputeDynamicVirtualScrollRangeOptions {
  readonly scrollTop: number;
  readonly viewportHeight: number;
  readonly itemCount: number;
  readonly overscan: number;
  readonly findStartIndex: (scrollTop: number) => number;
  readonly findEndIndex: (scrollBottom: number) => number;
  readonly getRowOffset: (index: number) => number;
}

/** Derive the visible slice and window offset for a fixed-height virtual list. */
export function computeVirtualScrollRange(
  options: ComputeVirtualScrollRangeOptions,
): VirtualScrollRange {
  const { scrollTop, viewportHeight, itemCount, rowHeight, overscan } = options;

  if (itemCount <= 0 || rowHeight <= 0) {
    return { start: 0, end: 0, visibleStart: 0, visibleEnd: 0, offsetY: 0 };
  }

  const scrollOffset = Math.max(0, scrollTop);
  const first = Math.floor(scrollOffset / rowHeight);
  const offsetWithinRow = scrollOffset % rowHeight;
  const visibleStart = Math.max(0, Math.min(itemCount - 1, first));
  const visible = Math.max(1, Math.ceil((offsetWithinRow + viewportHeight) / rowHeight));
  const visibleEnd = Math.min(itemCount - 1, first + visible - 1);
  const start = Math.max(0, first - overscan);
  const end = Math.min(itemCount, first + visible + overscan);
  const offsetY = start * rowHeight;

  return { start, end, visibleStart, visibleEnd, offsetY };
}

/** Derive the visible slice for variable-height rows via prefix offsets. */
export function computeDynamicVirtualScrollRange(
  options: ComputeDynamicVirtualScrollRangeOptions,
): VirtualScrollRange {
  const {
    scrollTop,
    viewportHeight,
    itemCount,
    overscan,
    findStartIndex,
    findEndIndex,
    getRowOffset,
  } = options;

  if (itemCount <= 0) {
    return { start: 0, end: 0, visibleStart: 0, visibleEnd: 0, offsetY: 0 };
  }

  const scrollOffset = Math.max(0, scrollTop);
  const visibleStart = findStartIndex(scrollOffset);
  const visibleEnd = Math.max(
    visibleStart,
    Math.min(itemCount - 1, findEndIndex(scrollOffset + viewportHeight) - 1),
  );
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(itemCount, visibleEnd + overscan + 1);
  const offsetY = getRowOffset(start);

  return { start, end, visibleStart, visibleEnd, offsetY };
}

export function rangesEqual(left: VirtualScrollRange, right: VirtualScrollRange): boolean {
  return left.start === right.start && left.end === right.end;
}

export function toVirtualScrollRangeChange(range: VirtualScrollRange): VirtualScrollRangeChange {
  return {
    startIndex: range.visibleStart,
    endIndex: range.visibleEnd,
    overscanStart: range.start,
    overscanEnd: Math.max(range.start, range.end - 1),
  };
}
