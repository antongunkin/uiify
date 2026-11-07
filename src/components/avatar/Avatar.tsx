import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { AvatarProps } from "./types.js";

export function Avatar<TAs extends ElementType = "span">(
  props: AvatarProps<TAs>,
): ReactElement | null {
  const { as, render, name, fallback, src, size, slotProps, ...consumerProps } =
    props as AvatarProps<"span">;

  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      role: "img",
      "aria-label": name,
      ...(size !== undefined ? { "data-size": size } : {}),
      ...consumerProps,
      className: cn(
        "uiify-avatar",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children:
        src !== undefined ? (
          <img
            src={src}
            alt=""
            {...slotProps?.image}
            className={cn("uiify-avatar-image", slotProps?.image?.className)}
          />
        ) : (
          <span
            aria-hidden="true"
            {...slotProps?.fallback}
            className={cn("uiify-avatar-fallback", slotProps?.fallback?.className)}
          >
            {fallback}
          </span>
        ),
    },
    render,
    state: {},
  });
}

Avatar.displayName = "Avatar";
