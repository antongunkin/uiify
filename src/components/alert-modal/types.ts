import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, SlotProps } from "../../core/slot-props.js";

export interface AlertModalOwnProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly actionLabel?: ReactNode;
  readonly cancelLabel?: ReactNode;
  /** Native props for each generated part; the AlertModal root takes props directly. */
  readonly slotProps?: AlertModalSlotProps;
}

type AlertModalInvokerSlotProps = Omit<
  SlotProps<"button">,
  "popoverTarget" | "popoverTargetAction"
> & {
  readonly command?: string | undefined;
  readonly commandfor?: string | undefined;
};

export interface AlertModalSlotProps {
  readonly trigger?: AlertModalInvokerSlotProps;
  readonly content?: Omit<SlotProps<"dialog">, "id" | "open" | "popover">;
  readonly title?: SlotProps<"h2">;
  readonly description?: SlotProps<"p">;
  readonly cancel?: AlertModalInvokerSlotProps;
  readonly action?: AlertModalInvokerSlotProps;
}

export type AlertModalProps = AlertModalOwnProps & Omit<SlotProps<"div">, keyof AlertModalOwnProps>;

export interface AlertModalTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `AlertModalContent` this button opens. */
  readonly target: string;
}

export type AlertModalTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalTriggerOwnProps
> &
  ConsumerDataAttributes;

export interface AlertModalActionOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalActionProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalActionOwnProps
> &
  ConsumerDataAttributes;

export interface AlertModalCancelOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalCancelProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertModalCancelOwnProps
> &
  ConsumerDataAttributes;

export interface AlertModalContentOwnProps {
  readonly children?: ReactNode;
  readonly id: string;
}

/** `<dialog role="alertdialog">`; `open` and `popover` use the native modal contract. */
export type AlertModalContentProps = AlertModalContentOwnProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof AlertModalContentOwnProps | "open" | "popover" | "dangerouslySetInnerHTML"
  > &
  ConsumerDataAttributes;
