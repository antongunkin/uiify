import type { VirtualScrollOrientation } from "./types.js";

/**
 * Logical scroll offset along the list axis. RTL `scrollLeft` runs from 0 to
 * `-max`, so its magnitude is the distance from the inline-start edge.
 */
export function readScrollOffset(
  element: HTMLElement,
  orientation: VirtualScrollOrientation,
): number {
  return orientation === "horizontal"
    ? Math.abs(element.scrollLeft) // banned-read-ok: scroll position drives the virtual range.
    : element.scrollTop; // banned-read-ok: scroll position drives the virtual range.
}

/** Move the scrollport to a logical offset along the list axis. */
export function writeScrollOffset(
  element: HTMLElement,
  orientation: VirtualScrollOrientation,
  offset: number,
  behavior: ScrollBehavior,
): void {
  if (orientation === "horizontal") {
    // `:dir()` resolves from the DOM `dir` attribute — no style or layout read.
    const left = element.matches(":dir(rtl)") ? -offset : offset;
    if (typeof element.scrollTo === "function") element.scrollTo({ left, behavior });
    else element.scrollLeft = left; // banned-read-ok: native scroll fallback for this viewport.
    return;
  }

  if (typeof element.scrollTo === "function") element.scrollTo({ top: offset, behavior });
  else element.scrollTop = offset; // banned-read-ok: native scroll fallback for this viewport.
}
