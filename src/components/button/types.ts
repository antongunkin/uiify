import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type ButtonVariant = "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";

export interface ButtonOwnProps {
  /** Prevents activation and exposes the disabled state to assistive technology. */
  readonly disabled?: boolean;
  /** Marks the button as the chosen one of a set, or a toggle that is on. */
  readonly selected?: boolean;
  /** Sets the native button action; defaults to `button`. Set `submit` or `reset` explicitly when needed. */
  readonly type?: "button" | "submit" | "reset";
  /** Sets the control's height and, for icon sizes, its width. */
  readonly size?: ButtonSize;
  /** Sets the visual treatment without changing the control's semantics. */
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
