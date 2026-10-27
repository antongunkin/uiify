import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { NativeButtonProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

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

type AlertModalSlotElementProps<T extends ElementType, TProtected extends string = never> = Omit<
  ComponentPropsWithRef<T>,
  "children" | "dangerouslySetInnerHTML" | TProtected
> &
  ConsumerDataAttributes & { readonly [K in TProtected]?: never };

type AlertModalInvokerSlotProps<TProtected extends string = never> = AlertModalSlotElementProps<
  "button",
  | "type"
  | "command"
  | "commandfor"
  | "commandFor"
  | "popoverTarget"
  | "popoverTargetAction"
  | "data-part"
  | "data-uiify-button"
  | "data-uiify-alert-modal"
  | TProtected
>;

type AlertModalChoiceSlotProps = AlertModalInvokerSlotProps<"value" | "data-variant">;

export interface AlertModalSlotProps {
  readonly trigger?: AlertModalInvokerSlotProps;
  readonly content?: AlertModalSlotElementProps<
    "dialog",
    | "id"
    | "role"
    | "open"
    | "popover"
    | "aria-describedby"
    | "aria-labelledby"
    | "data-part"
    | "data-uiify-alert-modal"
  >;
  readonly title?: AlertModalSlotElementProps<"h2", "id" | "data-part" | "data-uiify-alert-modal">;
  readonly description?: AlertModalSlotElementProps<
    "p",
    "id" | "data-part" | "data-uiify-alert-modal"
  >;
  readonly cancel?: AlertModalChoiceSlotProps;
  readonly action?: AlertModalChoiceSlotProps;
}

export type AlertModalProps = AlertModalOwnProps &
  Omit<
    AlertModalSlotElementProps<"div", "data-part" | "data-uiify-alert-modal">,
    keyof AlertModalOwnProps
  >;

export interface AlertModalTriggerOwnProps {
  readonly children?: ReactNode;
  /** `id` of the `AlertModalContent` this button opens. */
  readonly target: string;
}

export type AlertModalTriggerProps<TAs extends ElementType = "button"> = Omit<
  NativeButtonProps<TAs, AlertModalTriggerOwnProps>,
  "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
    readonly "data-uiify-button"?: never;
    readonly "data-uiify-alert-modal"?: never;
  };

export interface AlertModalActionOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalActionProps<TAs extends ElementType = "button"> = Omit<
  NativeButtonProps<TAs, AlertModalActionOwnProps>,
  "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
    readonly "data-variant"?: never;
    readonly "data-uiify-button"?: never;
    readonly "data-uiify-alert-modal"?: never;
  };

export interface AlertModalCancelOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}

export type AlertModalCancelProps<TAs extends ElementType = "button"> = Omit<
  NativeButtonProps<TAs, AlertModalCancelOwnProps>,
  "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
    readonly "data-variant"?: never;
    readonly "data-uiify-button"?: never;
    readonly "data-uiify-alert-modal"?: never;
  };

export interface AlertModalContentOwnProps {
  readonly children?: ReactNode;
  readonly id: string;
}

/** `<dialog role="alertdialog">`; `role`, `open` and `popover` belong to the part. */
export type AlertModalContentProps = AlertModalContentOwnProps &
  Omit<
    ComponentPropsWithRef<"dialog">,
    keyof AlertModalContentOwnProps | "open" | "popover" | "role" | "dangerouslySetInnerHTML"
  > &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
    readonly "data-uiify-alert-modal"?: never;
  };
