import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";

export interface AlertModalProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly actionLabel?: ReactNode;
  readonly cancelLabel?: ReactNode;
  readonly triggerClassName?: string;
  readonly className?: string;
  readonly actionClassName?: string;
  readonly cancelClassName?: string;
}

export interface AlertModalTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `AlertModalContent` this button opens. */
  readonly target: string;
}

export type AlertModalTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalTriggerOwnProps
>;

export interface AlertModalActionOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalActionProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalActionOwnProps
>;

export interface AlertModalCancelOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalCancelProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalCancelOwnProps
>;

export interface AlertModalContentOwnProps {
  readonly children?: ReactNode;
  readonly id: string;
}

/** `<dialog role="alertdialog">`; `role`, `open` and `popover` belong to the part. */
export type AlertModalContentProps = AlertModalContentOwnProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof AlertModalContentOwnProps | "open" | "popover" | "role"
  >;
