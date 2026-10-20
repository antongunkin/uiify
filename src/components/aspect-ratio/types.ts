import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface AspectRatioOwnProps {
  /** Positive finite width / height ratio. Omit to use the CSS default (square). */
  readonly ratio?: number;
  readonly children?: ReactNode;
}

export type AspectRatioProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  AspectRatioOwnProps,
  Record<string, never>,
  HTMLElement
>;
