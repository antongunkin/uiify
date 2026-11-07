import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { cn } from "../../core/class-names.js";
import type { ButtonElementProps, ButtonProps } from "./types.js";

function isNativeButton(as: ElementType | undefined): boolean {
  return as === undefined || as === "button";
}

export function Button<TAs extends ElementType = "button">(
  props: ButtonProps<TAs>,
): ReactElement | null {
  const {
    as: explicitAs,
    render,
    disabled = false,
    selected,
    size,
    type,
    variant,
    ...consumerProps
  } = props as ButtonElementProps<"button"> & { href?: string };

  // `href` without `as` is a link styled as a button, the same path as `as="a"`.
  const as =
    explicitAs === undefined && render === undefined && consumerProps.href !== undefined
      ? ("a" as const)
      : explicitAs;
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
      className: cn("uiify-button", (consumerProps as { className?: string }).className),
      // `default` is the unset look: no attribute, so the markup equals an omitted prop.
      ...(size !== undefined && size !== "default" ? { "data-size": size } : {}),
      ...(variant !== undefined && variant !== "default" ? { "data-variant": variant } : {}),
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
