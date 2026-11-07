// API research: Radix UI Aspect Ratio; independently authored from UIify design notes.
import type { CSSProperties, ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { AspectRatioProps } from "./types.js";

export function AspectRatio<TAs extends ElementType = "div">(
  props: AspectRatioProps<TAs>,
): ReactElement | null {
  const { as, render, ratio, children, slotProps, ...consumerProps } =
    props as AspectRatioProps<"div">;
  const style = (consumerProps as { style?: CSSProperties }).style;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      className: cn(
        "uiify-aspect-ratio",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      style: {
        ...(ratio !== undefined
          ? { "--uiify-aspect-ratio": Number.isFinite(ratio) && ratio > 0 ? ratio : 1 }
          : {}),
        ...style,
      } as CSSProperties,
      children: (
        <div
          {...slotProps?.content}
          className={cn("uiify-aspect-ratio-content", slotProps?.content?.className)}
        >
          {children}
        </div>
      ),
    },
    render,
    state: {},
  });
}
AspectRatio.displayName = "AspectRatio";
