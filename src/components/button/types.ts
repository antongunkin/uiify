import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type ButtonVariant = "solid" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonOwnProps {
  readonly disabled?: boolean;
  readonly type?: "button" | "submit" | "reset";
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
}

export interface ButtonState {
  readonly disabled: boolean;
}

export type ButtonProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  ButtonOwnProps,
  ButtonState,
  HTMLElement
>;
