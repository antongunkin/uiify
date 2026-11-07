import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

/** `default` is the unset look; `outline` drops the fill for a bordered rim. */
export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeOwnProps {
  readonly children?: ReactNode;
  readonly size?: BadgeSize;
  readonly variant?: BadgeVariant;
}

export type BadgeProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  BadgeOwnProps,
  Record<string, never>,
  HTMLElement
>;
