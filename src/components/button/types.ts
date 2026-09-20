import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface ButtonOwnProps {
  readonly disabled?: boolean;
  readonly type?: "button" | "submit" | "reset";
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
