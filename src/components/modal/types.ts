import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

export type ModalSize = "sm" | "md" | "lg" | "full";
export type ModalAlign = "center" | "start";
export type ModalDismiss = "any" | "closerequest" | "none";
export type ModalBackdrop = "opaque" | "blur" | "none";

export interface ModalAppearanceProps {
  /** Width step; `full` fills the viewport. Default `md`. */
  readonly size?: ModalSize | undefined;
  /**
   * Vertical position on tablet and desktop; phones get a bottom sheet unless `size` is `full`.
   * Default `center`.
   */
  readonly align?: ModalAlign | undefined;
  /**
   * Native `closedby`: `any` also closes on a backdrop tap, `closerequest` on Escape only, `none`
   * only through your own controls. Default `any`. Engines without `closedby` (Safari) ignore it:
   * Escape still closes the dialog there, and `UIEnhance` honours it only for its own backdrop
   * tap (`any` only) and sheet swipe (off for `none`).
   */
  readonly dismiss?: ModalDismiss | undefined;
  /** Backdrop treatment. Default `opaque`. */
  readonly backdrop?: ModalBackdrop | undefined;
}

export interface ModalProps extends ModalAppearanceProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  /** Accessible name of the header close icon. */
  readonly closeLabel?: string;
  /** Actions row pinned under the body. */
  readonly footer?: ReactNode;
  readonly className?: string;
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

export interface ModalContentOwnProps extends ModalAppearanceProps {
  readonly children?: ReactNode;
  /** Unique id supplied by the consumer; referenced by trigger and close `target`. */
  readonly id: string;
}

/** A plain, initially closed `<dialog>`: `open` and `popover` are not part of the native contract. */
export type ModalContentProps = ModalContentOwnProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof ModalContentOwnProps | "open" | "popover" | "closedby"
  >;

export interface ModalClientContentOwnProps extends ModalAppearanceProps {
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
export type ModalClientContentProps = ModalClientContentOwnProps &
  Omit<ComponentPropsWithRef<"dialog">, keyof ModalClientContentOwnProps | "popover" | "closedby">;

export type ModalHeaderProps = ComponentPropsWithRef<"div">;
export type ModalTitleProps = ComponentPropsWithRef<"h2">;
export type ModalDescriptionProps = ComponentPropsWithRef<"p">;
export type ModalBodyProps = ComponentPropsWithRef<"div">;
export type ModalFooterProps = ComponentPropsWithRef<"div">;
export type ModalGrabberProps = Omit<ComponentPropsWithRef<"div">, "children">;
