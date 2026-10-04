import type { CSSProperties, ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { SkeletonProps } from "./types.js";

function toCssSize(value: number | string | undefined): string | undefined {
  return typeof value === "number" ? `${value}px` : value;
}

export function Skeleton<TAs extends ElementType = "div">(
  props: SkeletonProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    circle = false,
    height,
    loading = true,
    width,
    variant,
    children,
    ...consumerProps
  } = props as SkeletonProps<"div">;
  const style = (consumerProps as { style?: CSSProperties }).style;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "aria-hidden": loading ? true : undefined,
      "data-uiify-skeleton": "",
      "data-shape": circle ? "circle" : "rect",
      "data-state": loading ? "loading" : "loaded",
      ...(variant !== undefined ? { "data-variant": variant } : {}),
      style: {
        ...style,
        ...(width !== undefined ? { "--uiify-skeleton-w": toCssSize(width) } : {}),
        ...(height !== undefined ? { "--uiify-skeleton-h": toCssSize(height) } : {}),
      } as CSSProperties,
      children: loading ? undefined : children,
    },
    render,
    state: { loading },
  });
}
Skeleton.displayName = "Skeleton";
