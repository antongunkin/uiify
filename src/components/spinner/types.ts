import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type SpinnerAlign = "center" | "fixed" | "absolute";
export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerLabels {
  readonly loading: string;
}

export interface SpinnerOwnProps {
  readonly align?: SpinnerAlign;
  readonly children?: ReactNode;
  readonly delay?: number;
  readonly label?: string;
  readonly labels?: Partial<SpinnerLabels>;
  readonly showLabel?: boolean;
  readonly size?: SpinnerSize;
}

export type SpinnerProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SpinnerOwnProps,
  { visible: boolean },
  HTMLElement
>;
