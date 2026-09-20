import type { BreadcrumbItemData } from "./types.js";

export interface CollapsedItems {
  readonly before: readonly BreadcrumbItemData[];
  readonly hidden: readonly BreadcrumbItemData[];
  readonly after: readonly BreadcrumbItemData[];
}

/** Slices a data-driven items array for `maxItems` collapsing. Operating on
 * an explicit array (rather than introspecting rendered children) means this
 * has no blind spot for items produced by `.map()` through a wrapper
 * component — see BreadcrumbListOwnProps.items's doc comment. */
export function collapseBreadcrumbItems(
  items: readonly BreadcrumbItemData[],
  maxItems: number,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number,
): CollapsedItems | undefined {
  if (items.length <= maxItems) return undefined;

  return {
    after: items.slice(items.length - itemsAfterCollapse),
    before: items.slice(0, itemsBeforeCollapse),
    hidden: items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse),
  };
}
