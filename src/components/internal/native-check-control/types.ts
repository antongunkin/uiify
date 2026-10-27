import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../../core/slot-props.js";

export type CheckedState = boolean | "indeterminate";

type NativeCheckControlInputOwnedAttributes = {
  readonly "aria-checked"?: never;
  readonly "aria-label"?: never;
  readonly "aria-labelledby"?: never;
  readonly "data-disabled"?: never;
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-checkbox"?: never;
};

type NativeCheckControlLabelOwnedAttributes = {
  readonly "data-uiify-checkbox"?: never;
  readonly id?: never;
};

export interface NativeCheckControlSlotProps {
  readonly input?: Omit<
    ComponentPropsWithRef<"input">,
    | "aria-checked"
    | "aria-label"
    | "aria-labelledby"
    | "checked"
    | "children"
    | "defaultChecked"
    | "defaultValue"
    | "disabled"
    | "dangerouslySetInnerHTML"
    | "id"
    | "name"
    | "type"
    | "value"
    | "data-disabled"
    | "data-part"
    | "data-state"
    | "data-uiify-checkbox"
  > &
    ConsumerDataAttributes &
    NativeCheckControlInputOwnedAttributes;
  readonly label?: Omit<
    ComponentPropsWithRef<"label">,
    "children" | "dangerouslySetInnerHTML" | "htmlFor" | "id" | "data-uiify-checkbox"
  > &
    ConsumerDataAttributes &
    NativeCheckControlLabelOwnedAttributes;
}

export interface NativeCheckControlProps {
  readonly id: string;
  readonly label?: ReactNode;
  readonly checked?: CheckedState;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly value?: string;
  readonly className?: string;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly slotProps?: NativeCheckControlSlotProps;
  readonly "aria-label"?: string;
}
