import type {
  DialogAlign,
  DialogAppearanceProps,
  DialogBackdrop,
  DialogDismiss,
  DialogSize,
} from "./types.js";

export interface DialogAppearanceAttributes {
  readonly closedby: DialogDismiss;
  readonly "data-align": DialogAlign | undefined;
  readonly "data-backdrop": DialogBackdrop | undefined;
  readonly "data-size": DialogSize | undefined;
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
}: DialogAppearanceProps): DialogAppearanceAttributes {
  return {
    closedby: dismiss,
    "data-align": align === "center" ? undefined : align,
    "data-backdrop": backdrop === "opaque" ? undefined : backdrop,
    "data-size": size === "md" ? undefined : size,
  };
}
