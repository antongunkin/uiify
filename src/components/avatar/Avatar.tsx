import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { AvatarProps } from "./types.js";

export function Avatar<TAs extends ElementType = "span">(
  props: AvatarProps<TAs>,
): ReactElement | null {
  const { as, render, name, fallback, src, size, ...consumerProps } = props as AvatarProps<"span">;

  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      ...consumerProps,
      role: (consumerProps as { role?: string }).role ?? "img",
      "aria-label": (consumerProps as { "aria-label"?: string })["aria-label"] ?? name,
      "data-uiify-avatar": "",
      ...(size !== undefined ? { "data-size": size } : {}),
      children:
        src !== undefined ? (
          <img data-part="image" src={src} alt="" />
        ) : (
          <span data-part="fallback" aria-hidden="true">
            {fallback}
          </span>
        ),
    },
    render,
    state: {},
  });
}

Avatar.displayName = "Avatar";
