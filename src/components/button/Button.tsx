import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { ButtonProps } from "./types.js";

function isNativeButton(as: ElementType | undefined): boolean {
  return as === undefined || as === "button";
}

export function Button<TAs extends ElementType = "button">(
  props: ButtonProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    disabled = false,
    selected,
    size,
    type,
    variant,
    ...consumerProps
  } = props as ButtonProps<"button">;

  const nativeButton = isNativeButton(as);
  // A toggle button reports its state through aria-pressed; anything that already names the
  // relation itself (current page, selected tab) keeps its own attribute.
  const ownsAria =
    "aria-pressed" in consumerProps ||
    "aria-current" in consumerProps ||
    "aria-selected" in consumerProps;

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      "data-uiify-button": "",
      ...(size !== undefined ? { "data-size": size } : {}),
      ...(variant !== undefined ? { "data-variant": variant } : {}),
      ...(selected ? { "data-selected": "" } : {}),
      ...(selected !== undefined && nativeButton && !ownsAria ? { "aria-pressed": selected } : {}),
      ...(nativeButton
        ? { type: type ?? "button", ...(disabled ? { disabled: true } : {}) }
        : disabled
          ? {
              "aria-disabled": true,
              tabIndex: -1,
              onClick: (event: { preventDefault: () => void }) => {
                event.preventDefault();
              },
            }
          : {}),
      ...(disabled ? { "data-disabled": "" } : {}),
    },
    render,
    state: { disabled, selected: selected ?? false },
  });
}
