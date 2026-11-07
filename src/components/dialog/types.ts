import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";
import type { SlotProps } from "../../core/slot-props.js";

export type DialogSize = "sm" | "md" | "lg" | "full";
export type DialogAlign = "center" | "start";
export type DialogDismiss = "any" | "closerequest" | "none";
export type DialogBackdrop = "opaque" | "blur" | "none";

export interface DialogAppearanceProps {
  /** Width step; `full` fills the viewport. Default `md`. */
  readonly size?: DialogSize | undefined;
  /**
   * Vertical position on tablet and desktop; phones get a bottom sheet unless `size` is `full`.
   * Default `center`.
   */
  readonly align?: DialogAlign | undefined;
  /**
   * Native `closedby`: `any` also closes on a backdrop tap, `closerequest` on Escape only, `none`
   * only through your own controls. Default `any`. Engines without `closedby` (Safari) ignore it:
   * Escape still closes the dialog there, and `UIEnhance` honours it only for its own backdrop
   * tap (`any` only) and sheet swipe (off for `none`).
   */
  readonly dismiss?: DialogDismiss | undefined;
  /** Backdrop treatment. Default `opaque`. */
  readonly backdrop?: DialogBackdrop | undefined;
}

export interface DialogOwnProps extends DialogAppearanceProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  /** Accessible name of the header close icon. */
  readonly closeLabel?: string;
  readonly labels?: Partial<DialogLabels>;
  /** Actions row pinned under the body. */
  readonly footer?: ReactNode;
  /** Native props for the elements created by this convenience component. */
  readonly slotProps?: DialogSlotProps;
}

/**
 * Popover attributes contradict a command invoker; `open`/`popover` contradict a modal dialog; the
 * dialog `id` is the Dialog's own `id` prop, which the trigger and close `target` reference.
 */
type CommandInvokerSlotProps = Omit<SlotProps<"button">, "popoverTarget" | "popoverTargetAction">;

/** Native props for Dialog's generated inner elements; consumer values replace the defaults. */
export interface DialogSlotProps {
  readonly trigger?: CommandInvokerSlotProps;
  readonly content?: Omit<SlotProps<"dialog">, "id" | "open" | "popover">;
  readonly grabber?: SlotProps<"div">;
  readonly header?: SlotProps<"div">;
  readonly title?: SlotProps<"h2">;
  readonly description?: SlotProps<"p">;
  readonly close?: CommandInvokerSlotProps;
  readonly body?: SlotProps<"div">;
  readonly footer?: SlotProps<"div">;
}

/** Native props for Dialog's root div plus its dialog and trigger contract. */
export type DialogProps = DialogOwnProps & Omit<SlotProps<"div">, keyof DialogOwnProps>;

export interface DialogLabels {
  readonly close: string;
}

/** Own props of the native `show-modal` invoker. */
export interface DialogTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `DialogContent` this button opens; the browser resolves it at click time. */
  readonly target: string;
}

export type DialogTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  DialogTriggerOwnProps
>;

/** Own props of the native `request-close` invoker. */
export interface DialogCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `DialogContent` this button closes. */
  readonly target: string;
}

export type DialogCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  DialogCloseOwnProps
>;

export interface DialogContentOwnProps extends DialogAppearanceProps {
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
}

/** A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract. */
export type DialogContentProps = DialogContentOwnProps &
  Omit<ComponentPropsWithRef<"dialog">, keyof DialogContentOwnProps | "open" | "popover">;

export interface DialogClientContentOwnProps extends DialogAppearanceProps {
  readonly children?: ReactNode;
  /** Uncontrolled initial state, applied with `showModal()` after hydration; SSR markup stays closed. */
  readonly defaultOpen?: boolean;
  readonly id: string;
  /**
   * Fires once per native or programmatic change with the state the element
   * just entered. Also fires once at mount if the browser opened the dialog
   * natively before hydration. Not reported: a pre-hydration open→close cycle
   * that nets back to closed — the DOM retains no `toggle` history, so there
   * is no evidence left that a transition happened at all.
   */
  readonly onOpenChange?: (open: boolean) => void;
  /**
   * Fires once per open or close transition, after the dialog's CSS transitions have
   * finished (immediately when there are none). This includes the transition that applies
   * `defaultOpen` after hydration; it does not fire for a dialog that never changes state.
   */
  readonly onOpenChangeComplete?: (open: boolean) => void;
  /** Controlled state, authoritative after hydration. */
  readonly open?: boolean;
}

/** Props of the client adapter; `popover` is excluded because the adapter is always modal. */
export type DialogClientContentProps = DialogClientContentOwnProps &
  Omit<ComponentPropsWithRef<"dialog">, keyof DialogClientContentOwnProps | "popover">;

export type DialogHeaderProps = ComponentPropsWithRef<"div">;
export type DialogTitleProps = ComponentPropsWithRef<"h2">;
export type DialogDescriptionProps = ComponentPropsWithRef<"p">;
export type DialogBodyProps = ComponentPropsWithRef<"div">;
export type DialogFooterProps = ComponentPropsWithRef<"div">;
export type DialogGrabberProps = Omit<ComponentPropsWithRef<"div">, "children">;
