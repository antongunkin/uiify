import type { ElementType, ReactElement } from "react";
import {
  PopoverClose as ElementPopoverClose,
  PopoverSurface as ElementPopoverSurface,
  PopoverTrigger as ElementPopoverTrigger,
} from "../../elements/popover/index.js";
import type {
  PopoverCloseProps,
  PopoverSurfaceProps,
  PopoverTriggerProps,
} from "../../elements/popover/index.js";
import type { PopupCloseProps, PopupContentProps, PopupTriggerProps } from "./types.js";

/**
 * Toggles `target`; light dismiss, Escape and nesting are handled by the browser.
 *
 * Built on `@gunkin/uiify/elements/popover`'s `Popover.Trigger`, which already emits
 * `data-uiify-popover-trigger` — the deprecated marker this component used to emit itself
 * now comes free from the element, so the
 * duplicate emission is deleted; this part adds only its own `data-uiify-popup-trigger`.
 * Calls the element as a plain function rather than rendering
 * `<ElementPopoverTrigger>`: Tier 0, no hooks (enforced by elements/architecture.test.ts), so
 * this is safe, and it skips a `jsx()` call — see ModalParts.tsx's `ModalTrigger` for the same
 * pattern and the byte-budget reasoning.
 */
export function PopupTrigger<TAs extends ElementType = "button">(
  props: PopupTriggerProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopupTriggerProps<"button">;
  return ElementPopoverTrigger({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-popup-trigger": "",
    target,
  } as unknown as PopoverTriggerProps<TAs>);
}
PopupTrigger.displayName = "PopupTrigger";

/**
 * The popover surface. `data-side`/`data-align` drive the optional anchor CSS in @gunkin/uiify/styles.
 *
 * Built on `@gunkin/uiify/elements/popover`'s `Popover.Surface`, which already emits
 * `data-uiify-popover-surface`; this part adds its own `data-uiify-popup-content` and the
 * deprecated `data-uiify-popover-content` (a different string from the element's own marker,
 * so additive — unlike Trigger/Close above).
 */
export function PopupContent(props: PopupContentProps): ReactElement {
  return ElementPopoverSurface({
    ...props,
    "data-uiify-popover-content": "",
    "data-uiify-popup-content": "",
  } as unknown as PopoverSurfaceProps);
}
PopupContent.displayName = "PopupContent";

/**
 * Hides `target`.
 *
 * Built on `@gunkin/uiify/elements/popover`'s `Popover.Close` (`action="hide"`), which already emits
 * `data-uiify-popover-close`; this part adds its own `data-uiify-popup-close`.
 */
export function PopupClose<TAs extends ElementType = "button">(
  props: PopupCloseProps<TAs>,
): ReactElement {
  const { as, target, ...consumerProps } = props as PopupCloseProps<"button">;
  return ElementPopoverClose({
    ...consumerProps,
    ...(as === undefined ? {} : { as }),
    "data-uiify-popup-close": "",
    target,
  } as unknown as PopoverCloseProps<TAs>);
}
PopupClose.displayName = "PopupClose";
