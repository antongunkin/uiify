import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { BadgeProps } from "./types.js";

export function Badge<TAs extends ElementType = "span">(
  props: BadgeProps<TAs>,
): ReactElement | null {
  const { as, render, size, variant, ...consumerProps } = props as BadgeProps<"span">;
  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      ...(size !== undefined ? { "data-size": size } : {}),
      // `default` is the unset look: no attribute, so the markup equals an omitted prop.
      ...(variant !== undefined && variant !== "default" ? { "data-variant": variant } : {}),
      ...consumerProps,
      className: cn("uiify-badge", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

Badge.displayName = "Badge";
