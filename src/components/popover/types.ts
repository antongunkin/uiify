import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

/** Native parts surface modes — the cross-engine baseline. */
export type PopoverSurfaceMode = "auto" | "manual";

export type AnchorSide = "top" | "right" | "bottom" | "left";

export type AnchorAlign = "start" | "center" | "end";

// ---------------------------------------------------------------------------
// Native parts: explicit ids, popovertarget invokers, implicit anchor.
// ---------------------------------------------------------------------------

export interface PopoverTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `PopoverContent` this button toggles. */
  readonly target: string;
}

export type PopoverTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopoverTriggerOwnProps
>;

export interface PopoverCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `PopoverContent` this button hides. */
  readonly target: string;
}

export type PopoverCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopoverCloseOwnProps
>;

export interface PopoverContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
  readonly mode?: PopoverSurfaceMode;
  readonly side?: AnchorSide;
}

export type PopoverContentProps = PopoverContentOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof PopoverContentOwnProps | "popover">;
