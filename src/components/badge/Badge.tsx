import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { BadgeProps } from "./types.js";

export function Badge<TAs extends ElementType = "span">(
  props: BadgeProps<TAs>,
): ReactElement | null {
  const { as, render, size, variant, ...consumerProps } = props as BadgeProps<"span">;
  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      ...consumerProps,
      "data-uiify-badge": "",
      ...(size !== undefined ? { "data-size": size } : {}),
      ...(variant !== undefined ? { "data-variant": variant } : {}),
    },
    render,
    state: {},
  });
}

Badge.displayName = "Badge";
