import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { ButtonProps } from "./types.js";

function isNativeButton(as: ElementType | undefined): boolean {
  return as === undefined || as === "button";
}

export function Button<TAs extends ElementType = "button">(
  props: ButtonProps<TAs>,
): ReactElement | null {
  const { as, render, disabled = false, type, ...consumerProps } = props as ButtonProps<"button">;

  const nativeButton = isNativeButton(as);

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      "data-uiify-button": "",
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
    state: { disabled },
  });
}
