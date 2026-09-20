import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SkeletonOwnProps {
  readonly circle?: boolean;
  readonly height?: number | string;
  readonly loading?: boolean;
  readonly width?: number | string;
  readonly children?: ReactNode;
}

export type SkeletonProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SkeletonOwnProps,
  { loading: boolean },
  HTMLElement
>;

export interface SkeletonLoadingProps {
  readonly as: ElementType | undefined;
  readonly circle: boolean;
  readonly elementProps: Record<string, unknown>;
  readonly height: number | string | undefined;
  readonly render: SkeletonProps<"div">["render"] | undefined;
  readonly width: number | string | undefined;
}
