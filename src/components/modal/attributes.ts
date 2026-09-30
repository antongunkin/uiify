import type {
  ModalAlign,
  ModalAppearanceProps,
  ModalBackdrop,
  ModalDismiss,
  ModalSize,
} from "./types.js";

export interface ModalAppearanceAttributes {
  readonly closedby: ModalDismiss;
  readonly "data-align": ModalAlign | undefined;
  readonly "data-backdrop": ModalBackdrop | undefined;
  readonly "data-size": ModalSize | undefined;
}

/**
 * DOM attributes for the appearance props. Defaults (`md`, `center`, `opaque`) render nothing;
 * `closedby` is always rendered because `UIEnhance` reads it.
 */
export function modalAppearanceAttributes({
  align,
  backdrop,
  dismiss = "any",
  size,
}: ModalAppearanceProps): ModalAppearanceAttributes {
  return {
    closedby: dismiss,
    "data-align": align === "center" ? undefined : align,
    "data-backdrop": backdrop === "opaque" ? undefined : backdrop,
    "data-size": size === "md" ? undefined : size,
  };
}
