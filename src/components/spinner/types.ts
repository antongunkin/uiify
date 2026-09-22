import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type SpinnerAlign = "center" | "fixed" | "absolute";
export type SpinnerSize = "small" | "default" | "large";

export interface SpinnerOwnProps {
  readonly align?: SpinnerAlign;
  readonly children?: ReactNode;
  readonly delay?: number;
  readonly label?: string;
  readonly showLabel?: boolean;
  readonly size?: SpinnerSize;
}

export type SpinnerProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SpinnerOwnProps,
  { visible: boolean },
  HTMLElement
>;
