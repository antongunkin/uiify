import type {
  VirtualScrollScrollAlign,
  VirtualScrollScrollBehavior,
  VirtualScrollScrollBehaviorOptions,
  VirtualScrollScrollToIndexOptions,
} from "./types.js";

export interface VirtualScrollScrollMetrics {
  readonly getRowOffset: (index: number) => number;
  readonly getRowHeight: (index: number) => number;
  readonly getTotalSize: () => number;
}

export function resolveScrollBehavior(
  behavior: VirtualScrollScrollBehavior | undefined,
): ScrollBehavior {
  if (behavior === "instant") return "auto";
  return behavior ?? "auto";
}

export function clampScrollOffset(
  offset: number,
  totalSize: number,
  viewportHeight: number,
): number {
  const maxOffset = Math.max(0, totalSize - viewportHeight);
  return Math.min(maxOffset, Math.max(0, offset));
}

export function computeScrollOffsetForIndex(
  index: number,
  align: VirtualScrollScrollAlign,
  metrics: VirtualScrollScrollMetrics,
  viewportHeight: number,
  scrollTop: number,
): number {
  const rowOffset = metrics.getRowOffset(index);
  const rowHeight = metrics.getRowHeight(index);
  const totalSize = metrics.getTotalSize();

  if (align === "start") {
    return clampScrollOffset(rowOffset, totalSize, viewportHeight);
  }

  if (align === "center") {
    return clampScrollOffset(
      rowOffset - (viewportHeight - rowHeight) / 2,
      totalSize,
      viewportHeight,
    );
  }

  if (align === "end") {
    return clampScrollOffset(rowOffset - viewportHeight + rowHeight, totalSize, viewportHeight);
  }

  const rowEnd = rowOffset + rowHeight;
  const viewportEnd = scrollTop + viewportHeight;
  if (rowOffset >= scrollTop && rowEnd <= viewportEnd) {
    return scrollTop;
  }
  if (rowOffset < scrollTop) {
    return clampScrollOffset(rowOffset, totalSize, viewportHeight);
  }
  return clampScrollOffset(rowEnd - viewportHeight, totalSize, viewportHeight);
}

export function normalizeScrollToIndexOptions(
  options?: VirtualScrollScrollToIndexOptions,
): Required<Pick<VirtualScrollScrollToIndexOptions, "align" | "behavior">> {
  return {
    align: options?.align ?? "auto",
    behavior: options?.behavior ?? "auto",
  };
}

export function normalizeScrollBehaviorOptions(
  options?: VirtualScrollScrollBehaviorOptions,
): VirtualScrollScrollBehavior {
  return options?.behavior ?? "auto";
}

export function isSmoothScrollActive(
  behavior: VirtualScrollScrollBehavior,
  currentScrollTop: number,
  targetScrollTop: number,
): boolean {
  return behavior === "smooth" && Math.abs(currentScrollTop - targetScrollTop) > 1;
}
