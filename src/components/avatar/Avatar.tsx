import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
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
      "data-uiify-avatar": "",
      ...(size !== undefined ? { "data-size": size } : {}),
      ...consumerProps,
      children:
        src !== undefined ? (
          <img data-part="image" src={src} alt="" {...slotProps?.image} />
        ) : (
          <span data-part="fallback" aria-hidden="true" {...slotProps?.fallback}>
            {fallback}
          </span>
        ),
    },
    render,
    state: {},
  });
}

Avatar.displayName = "Avatar";
