import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SkeletonOwnProps {
  readonly circle?: boolean;
  readonly height?: number | string;
  readonly loading?: boolean;
  readonly variant?: "pulse" | "shimmer" | "none";
  readonly width?: number | string;
  readonly children?: ReactNode;
}

export type SkeletonProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SkeletonOwnProps,
  { loading: boolean },
  HTMLElement
>;
