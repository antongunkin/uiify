import type { VirtualScrollRange } from "./virtual-scroll-range.js";

/** Imperatively update row positions from scrollTop so the viewport stays filled before React paints. */
export function applyVirtualScrollRangeToDom(
  scrollport: HTMLElement,
  range: VirtualScrollRange,
  options: {
    readonly dynamicLayout: boolean;
    readonly slotCount: number;
    readonly getRowOffset: (index: number) => number;
  },
): void {
  const spacer = scrollport.querySelector('[data-part="spacer"]');
  if (!(spacer instanceof HTMLElement)) return;

  if (!options.dynamicLayout) {
    spacer.style.setProperty("--uiify-range-start", String(range.start));
    return;
  }

  const rows = spacer.querySelectorAll('[data-part="row"]');
  for (let slotIndex = 0; slotIndex < options.slotCount; slotIndex++) {
    const row = rows[slotIndex];
    if (!(row instanceof HTMLElement)) continue;
    const index = range.start + slotIndex;
    row.style.setProperty("--uiify-row-offset", `${options.getRowOffset(index)}px`);
  }
}
