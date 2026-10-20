import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type BadgeVariant = "secondary" | "success" | "warning" | "destructive";
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
