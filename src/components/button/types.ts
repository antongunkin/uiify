import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type ButtonVariant = "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";

export interface ButtonOwnProps {
  readonly disabled?: boolean;
  /** Marks the button as the chosen one of a set, or a toggle that is on. */
  readonly selected?: boolean;
  readonly type?: "button" | "submit" | "reset";
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
}

export interface ButtonState {
  readonly disabled: boolean;
  readonly selected: boolean;
}

export type ButtonProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  ButtonOwnProps,
  ButtonState,
  HTMLElement
>;
