import type { Direction } from "./direction.js";

/**
 * Resolves the effective text direction at event time with a selector match
 * (no layout read). An explicit `override` wins over the DOM.
 */
export function resolveDirection(
  element: Element | null | undefined,
  override?: Direction,
): Direction {
  return override ?? (element?.matches(":dir(rtl)") ? "rtl" : "ltr");
}
