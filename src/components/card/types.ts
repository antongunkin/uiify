import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface CardOwnProps {
  readonly children?: ReactNode;
}

export type CardProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  CardOwnProps,
  Record<string, never>,
  HTMLElement
>;
