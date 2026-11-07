import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, SlotProps } from "../../core/slot-props.js";

export interface AlertDialogOwnProps {
  readonly id: string;
  readonly trigger: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children?: ReactNode;
  readonly actionLabel?: ReactNode;
  readonly cancelLabel?: ReactNode;
  /** Native props for each generated part; the AlertDialog root takes props directly. */
  readonly slotProps?: AlertDialogSlotProps;
}

type AlertDialogInvokerSlotProps = Omit<
  SlotProps<"button">,
  "popoverTarget" | "popoverTargetAction"
> & {
  readonly command?: string | undefined;
  readonly commandfor?: string | undefined;
};

export interface AlertDialogSlotProps {
  readonly trigger?: AlertDialogInvokerSlotProps;
  readonly content?: Omit<SlotProps<"dialog">, "id" | "open" | "popover">;
  readonly title?: SlotProps<"h2">;
  readonly description?: SlotProps<"p">;
  readonly cancel?: AlertDialogInvokerSlotProps;
  readonly action?: AlertDialogInvokerSlotProps;
}

export type AlertDialogProps = AlertDialogOwnProps &
  Omit<SlotProps<"div">, keyof AlertDialogOwnProps>;

export interface AlertDialogTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `AlertDialogContent` this button opens. */
  readonly target: string;
}

export type AlertDialogTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertDialogTriggerOwnProps
> &
  ConsumerDataAttributes;

export interface AlertDialogActionOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertDialogActionProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertDialogActionOwnProps
> &
  ConsumerDataAttributes;

export interface AlertDialogCancelOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertDialogCancelProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  AlertDialogCancelOwnProps
> &
  ConsumerDataAttributes;

export interface AlertDialogContentOwnProps {
  readonly children?: ReactNode;
  readonly id: string;
}

/** `<dialog role="alertdialog">`; `open` and `popover` use the native modal contract. */
export type AlertDialogContentProps = AlertDialogContentOwnProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof AlertDialogContentOwnProps | "open" | "popover" | "dangerouslySetInnerHTML"
  > &
  ConsumerDataAttributes;
