import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

export interface ModalProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly closeLabel?: ReactNode;
  readonly triggerClassName?: string;
  readonly className?: string;
  readonly closeClassName?: string;
}

/** Own props of the native `show-modal` invoker. */
export interface ModalTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `ModalContent` this button opens; the browser resolves it at click time. */
  readonly target: string;
}

export type ModalTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  ModalTriggerOwnProps
>;

/** Own props of the native `request-close` invoker. */
export interface ModalCloseOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `ModalContent` this button closes. */
  readonly target: string;
}

export type ModalCloseProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  ModalCloseOwnProps
>;

export interface ModalContentOwnProps {
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
}

/** A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract. */
export type ModalContentProps = ModalContentOwnProps &
  Omit<ComponentPropsWithRef<"dialog">, keyof ModalContentOwnProps | "open" | "popover">;

export interface ModalClientContentOwnProps {
  readonly children?: ReactNode;
  /**
   * Close when the backdrop is clicked — a click whose target is the `<dialog>`
   * itself, not one of its children. Default `false` (matches the native parts).
   */
  readonly closeOnBackdropClick?: boolean;
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
  /** Controlled state, authoritative after hydration. */
  readonly open?: boolean;
}

/** Props of the client adapter; `popover` is excluded because the adapter is always modal. */
export type ModalClientContentProps = ModalClientContentOwnProps &
  Omit<ComponentPropsWithRef<"dialog">, keyof ModalClientContentOwnProps | "popover">;
