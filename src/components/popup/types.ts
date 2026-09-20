import type { ComponentPropsWithRef, ElementType, HTMLAttributes, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

/** Legacy compound modes; `hint` is not part of the native parts API. */
export type PopupMode = "auto" | "manual" | "hint";

/** Native parts surface modes — the cross-engine baseline. */
export type PopupSurfaceMode = "auto" | "manual";

export type AnchorSide = "top" | "right" | "bottom" | "left";

export type AnchorAlign = "start" | "center" | "end";

// ---------------------------------------------------------------------------
// Legacy compound API: Popup.Root injects ids into direct children.
// Kept until a separate breaking release; not used by the native parts.
// ---------------------------------------------------------------------------

export interface PopupInjectedProps {
  readonly __mode?: PopupMode;
  readonly __popupId?: string;
}

export interface PopupContextValue {
  readonly id: string;
  readonly mode: PopupMode;
}

export type PopupPartName = "trigger" | "content" | "close";

export interface PopupRootOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  /** Stable id for the popover surface and invoker commands. Required. */
  readonly id: string;
  readonly mode?: PopupMode;
}

export interface PopupRootProps
  extends PopupRootOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof PopupRootOwnProps> {}

export interface PopupRootTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type PopupRootTriggerProps = PopupRootTriggerOwnProps &
  Omit<HTMLAttributes<HTMLButtonElement>, keyof PopupRootTriggerOwnProps>;

export type PopupTriggerInternalProps = PopupRootTriggerProps & PopupInjectedProps;

export interface PopupRootContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly side?: AnchorSide;
}

export type PopupRootContentProps = PopupRootContentOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof PopupRootContentOwnProps>;

export type PopupContentInternalProps = PopupRootContentProps & PopupInjectedProps;

export interface PopupRootCloseOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type PopupRootCloseProps = PopupRootCloseOwnProps &
  Omit<HTMLAttributes<HTMLButtonElement>, keyof PopupRootCloseOwnProps>;

export type PopupCloseInternalProps = PopupRootCloseProps & PopupInjectedProps;

// ---------------------------------------------------------------------------
// Native parts: explicit ids, popovertarget invokers, implicit anchor.
// ---------------------------------------------------------------------------

export interface PopupTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `PopupContent` this button toggles. */
  readonly target: string;
}

export type PopupTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopupTriggerOwnProps
>;

export interface PopupCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `PopupContent` this button hides. */
  readonly target: string;
}

export type PopupCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  PopupCloseOwnProps
>;

export interface PopupContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
  readonly mode?: PopupSurfaceMode;
  readonly side?: AnchorSide;
}

export type PopupContentProps = PopupContentOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof PopupContentOwnProps | "popover">;
