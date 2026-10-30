import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

/** Cross-engine baseline; `hint` is not part of this element's contract. */
export type PopoverSurfaceMode = "auto" | "manual";

export type AnchorSide = "top" | "right" | "bottom" | "left";

export type AnchorAlign = "start" | "center" | "end";

type PopoverInvokerNativeProps = Pick<
  ComponentPropsWithRef<"button">,
  "popoverTarget" | "popoverTargetAction"
>;

/** What a trigger does to its target popover when activated. */
export type PopoverTriggerAction = "toggle" | "show" | "hide";

export interface PopoverTriggerOwnProps {
  readonly children?: ReactNode;
  /** Defaults to `"toggle"`. */
  readonly action?: PopoverTriggerAction;
  /** `id` of the `Popover.Surface` this button acts on. */
  readonly target: string;
}

export type PopoverTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopoverTriggerOwnProps & PopoverInvokerNativeProps
>;

export interface PopoverCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `Popover.Surface` this button hides. */
  readonly target: string;
}

export type PopoverCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopoverCloseOwnProps & PopoverInvokerNativeProps
>;

export interface PopoverSurfaceOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
  readonly mode?: PopoverSurfaceMode;
  readonly side?: AnchorSide;
}

/** Native props can override the surface defaults. */
export type PopoverSurfaceProps = PopoverSurfaceOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof PopoverSurfaceOwnProps>;
