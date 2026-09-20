import type { CSSProperties, ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { SkeletonProps, SkeletonLoadingProps } from "./types.js";

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
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
    children,
    ...consumerProps
  } = props as SkeletonProps<"div">;

  if (!loading) {
    return children as ReactElement | null;
  }

  return (
    <SkeletonLoading
      as={as}
      circle={circle}
      elementProps={consumerProps}
      height={height}
      render={render}
      width={width}
    />
  );
}
Skeleton.displayName = "Skeleton";

function SkeletonLoading({
  as,
  circle,
  elementProps,
  height,
  render,
  width,
}: SkeletonLoadingProps): ReactElement | null {
  const { style: consumerStyle, ...rest } = elementProps;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...rest,
      "aria-hidden": true,
      "data-shape": circle ? "circle" : "rect",
      "data-state": "loading",
      style: {
        ...(consumerStyle as CSSProperties | undefined),
        "--skeleton-h": toCssSize(height) ?? "",
        "--skeleton-w": toCssSize(width) ?? "",
      } as CSSProperties,
    },
    render,
    state: { loading: true },
  });
}
