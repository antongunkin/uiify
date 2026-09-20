import { VIRTUAL_SCROLL_ANCHOR_THRESHOLD } from "./types.js";

export interface VirtualScrollAnchorSnapshot {
  readonly firstItemId: string | undefined;
  readonly itemCount: number;
  readonly totalSize: number;
  readonly scrollTop: number;
}

export interface ResolveVirtualScrollAnchorAdjustmentOptions {
  readonly anchor: "start" | "end";
  readonly followAppend: boolean | "smooth";
  readonly viewportHeight: number;
  readonly previous: VirtualScrollAnchorSnapshot;
  readonly next: VirtualScrollAnchorSnapshot;
}

export interface VirtualScrollAnchorAdjustment {
  readonly delta: number;
  readonly behavior: ScrollBehavior;
}

/** Preserve scroll position across prepend/append when anchored or pinned to end. */
export function resolveVirtualScrollAnchorAdjustment(
  options: ResolveVirtualScrollAnchorAdjustmentOptions,
): VirtualScrollAnchorAdjustment | null {
  const { anchor, followAppend, viewportHeight, previous, next } = options;
  const sizeDelta = next.totalSize - previous.totalSize;
  if (sizeDelta === 0 || next.itemCount === 0) return null;

  const wasAtBottom =
    previous.scrollTop + viewportHeight >= previous.totalSize - VIRTUAL_SCROLL_ANCHOR_THRESHOLD; // banned-read-ok: compare the saved viewport position.

  if (anchor === "end" && (wasAtBottom || followAppend)) {
    return {
      delta: sizeDelta,
      behavior: followAppend === "smooth" ? "smooth" : "auto",
    };
  }

  const prepended =
    next.itemCount > previous.itemCount &&
    next.firstItemId !== previous.firstItemId &&
    previous.firstItemId !== undefined;

  if (prepended && !wasAtBottom) {
    return { delta: sizeDelta, behavior: "auto" };
  }

  return null;
}
