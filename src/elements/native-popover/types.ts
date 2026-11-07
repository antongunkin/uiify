import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

/** Cross-engine baseline; `hint` is not part of this element's contract. */
export type NativePopoverSurfaceMode = "auto" | "manual";

export type AnchorSide = "top" | "right" | "bottom" | "left";

export type AnchorAlign = "start" | "center" | "end";

type NativePopoverInvokerNativeProps = Pick<
  ComponentPropsWithRef<"button">,
  "popoverTarget" | "popoverTargetAction"
>;

/** What a trigger does to its target popover when activated. */
export type NativePopoverTriggerAction = "toggle" | "show" | "hide";

export interface NativePopoverTriggerOwnProps {
  readonly children?: ReactNode;
  /** Defaults to `"toggle"`. */
  readonly action?: NativePopoverTriggerAction;
  /** `id` of the `NativePopover.Surface` this button acts on. */
  readonly target: string;
}

export type NativePopoverTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  NativePopoverTriggerOwnProps & NativePopoverInvokerNativeProps
>;

export interface NativePopoverCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `NativePopover.Surface` this button hides. */
  readonly target: string;
}

export type NativePopoverCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  NativePopoverCloseOwnProps & NativePopoverInvokerNativeProps
>;

export interface NativePopoverSurfaceOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
  readonly mode?: NativePopoverSurfaceMode;
  readonly side?: AnchorSide;
}

/** Native props can override the surface defaults. */
export type NativePopoverSurfaceProps = NativePopoverSurfaceOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof NativePopoverSurfaceOwnProps>;
