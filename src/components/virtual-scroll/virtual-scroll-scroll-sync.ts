import type { CSSProperties } from "react";
import type { VirtualScrollRange } from "./virtual-scroll-range.js";

/** Imperatively update row positions from scrollTop so the viewport stays filled before React paints. */
export function applyVirtualScrollRangeToDom(
  scrollport: HTMLElement,
  range: VirtualScrollRange,
  options: {
    readonly dynamicLayout: boolean;
    readonly slotCount: number;
    readonly getRowOffset: (index: number) => number;
    readonly spacerStyle?: CSSProperties | undefined;
    readonly getRowStyle?: (index: number) => CSSProperties | undefined;
  },
): void {
  const spacer = scrollport.querySelector('[data-part="spacer"]');
  if (!(spacer instanceof HTMLElement)) return;

  if (!options.dynamicLayout) {
    const style = { "--uiify-range-start": String(range.start), ...options.spacerStyle };
    const value = style["--uiify-range-start"];
    if (value === undefined) spacer.style.removeProperty("--uiify-range-start");
    else spacer.style.setProperty("--uiify-range-start", value);
    return;
  }

  const rows = spacer.querySelectorAll('[data-part="row"]');
  for (let slotIndex = 0; slotIndex < options.slotCount; slotIndex++) {
    const row = rows[slotIndex];
    if (!(row instanceof HTMLElement)) continue;
    const index = range.start + slotIndex;
    const style = {
      "--uiify-row-offset": `${options.getRowOffset(index)}px`,
      ...options.getRowStyle?.(index),
    };
    const value = style["--uiify-row-offset"];
    if (value === undefined) row.style.removeProperty("--uiify-row-offset");
    else row.style.setProperty("--uiify-row-offset", value);
  }
}
