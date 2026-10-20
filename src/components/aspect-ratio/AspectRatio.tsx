// API research: Radix UI Aspect Ratio; independently authored from UIify design notes.
import type { CSSProperties, ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { AspectRatioProps } from "./types.js";

export function AspectRatio<TAs extends ElementType = "div">(
  props: AspectRatioProps<TAs>,
): ReactElement | null {
  const { as, render, ratio, children, ...consumerProps } = props as AspectRatioProps<"div">;
  const style = (consumerProps as { style?: CSSProperties }).style;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-uiify-aspect-ratio": "",
      style: {
        ...style,
        ...(ratio !== undefined
          ? { "--uiify-aspect-ratio": Number.isFinite(ratio) && ratio > 0 ? ratio : 1 }
          : {}),
      } as CSSProperties,
      children: <div data-part="content">{children}</div>,
    },
    render,
    state: {},
  });
}
AspectRatio.displayName = "AspectRatio";
