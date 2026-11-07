import type { ComponentPropsWithRef, ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

/** `default` is the filled foreground action, the same as leaving `variant` unset. */
export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
/** `default` is the standard height, the same as leaving `size` unset. */
export type ButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "lg"
  | "icon-xs"
  | "icon-sm"
  | "icon"
  | "icon-lg";

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

/**
 * Link branch: `href` without `as` renders an `<a>` with the Button skin, equivalent to
 * `as="a"`. Button-only props (`type`, `form*`) are not offered here.
 */
export type ButtonLinkProps = ButtonOwnProps & {
  /** A link has no native button action. */
  readonly type?: never;
  /** Renders a link styled as a button. Without `as`, `href` selects the `a` element. */
  readonly href: string;
} & Omit<ComponentPropsWithRef<"a">, keyof ButtonOwnProps | "href" | "as" | "render">;

/** Props of the polymorphic branch: a native button, `as`, or a render callback. */
export type ButtonElementProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  ButtonOwnProps,
  ButtonState,
  HTMLElement
>;

export type ButtonProps<TAs extends ElementType = "button"> =
  | (ButtonElementProps<TAs> & (TAs extends "button" ? { readonly href?: never } : unknown))
  | ButtonLinkProps;
