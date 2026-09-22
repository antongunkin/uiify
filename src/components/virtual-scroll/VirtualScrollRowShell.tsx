"use client";

import type { CSSProperties, ReactElement, ReactNode } from "react";
import type { VirtualScrollListRole } from "./types.js";

export function computeVirtualScrollSlotCount(
  viewportHeight: number,
  rowHeight: number,
  overscan: number,
): number {
  if (rowHeight <= 0) return 0;
  const visible = Math.max(1, Math.ceil(viewportHeight / rowHeight));
  return visible + overscan * 2;
}

/** Clamp pooled slot count so indices never exceed the list tail. */
export function computeActiveVirtualScrollSlotCount(
  itemCount: number,
  rangeStart: number,
  slotCount: number,
): number {
  if (itemCount <= 0 || slotCount <= 0) return 0;
  return Math.min(slotCount, Math.max(0, itemCount - rangeStart));
}

interface VirtualScrollRowShellProps {
  readonly slotIndex: number;
  readonly index: number;
  readonly itemCount: number;
  readonly listRole: VirtualScrollListRole;
  readonly rowOffset?: number;
  readonly rowHeight?: number;
  readonly dynamicLayout: boolean;
  readonly children: ReactNode;
}

/**
 * Row shell — static `--uiify-slot-index` in fixed mode; per-row offset in dynamic mode.
 *
 * Stateless by design: measurement is owned by the single ResizeObserver that
 * VirtualScroll attaches to the row Fragment, so this component holds no hooks.
 * `data-row-index` is how that observer's callback maps an entry back to
 * a list index.
 */
export function VirtualScrollRowShell({
  slotIndex,
  index,
  itemCount,
  listRole,
  rowOffset,
  rowHeight,
  dynamicLayout,
  children,
}: VirtualScrollRowShellProps): ReactElement {
  const style = {
    "--uiify-slot-index": slotIndex,
    ...(dynamicLayout && rowOffset !== undefined ? { "--uiify-row-offset": `${rowOffset}px` } : {}),
    ...(dynamicLayout && rowHeight !== undefined ? { "--uiify-row-height": `${rowHeight}px` } : {}),
  } as CSSProperties;

  return (
    <div
      data-part="row"
      data-dynamic-row={dynamicLayout ? "" : undefined}
      data-row-index={index}
      role={listRole === "list" ? "listitem" : "row"}
      aria-setsize={itemCount}
      aria-posinset={index + 1}
      style={style}
    >
      {children}
    </div>
  );
}
VirtualScrollRowShell.displayName = "VirtualScrollRowShell";
