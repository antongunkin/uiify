import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

type ToggleControlOwnedAttributes = {
  readonly "aria-labelledby"?: never;
  readonly "data-disabled"?: never;
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-toggle"?: never;
  readonly checked?: never;
  readonly defaultChecked?: never;
  readonly disabled?: never;
  readonly id?: never;
  readonly type?: never;
};

type ToggleLabelOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-button"?: never;
  readonly "data-variant"?: never;
  readonly htmlFor?: never;
  readonly id?: never;
};

export type ToggleControlSlotProps = Omit<
  ComponentPropsWithRef<"input">,
  | "aria-labelledby"
  | "checked"
  | "data-disabled"
  | "data-part"
  | "data-state"
  | "data-uiify-toggle"
  | "defaultChecked"
  | "disabled"
  | "id"
  | "type"
> &
  ToggleControlOwnedAttributes &
  ConsumerDataAttributes;

export type ToggleLabelSlotProps = Omit<
  ComponentPropsWithRef<"label">,
  "children" | "data-part" | "data-uiify-button" | "data-variant" | "htmlFor" | "id"
> &
  ToggleLabelOwnedAttributes &
  ConsumerDataAttributes;

export interface ToggleSlotProps {
  readonly control?: ToggleControlSlotProps;
  readonly label?: ToggleLabelSlotProps;
}

export interface ToggleOwnProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly disabled?: boolean;
  readonly slotProps?: ToggleSlotProps;
}

export type ToggleProps = ToggleOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    | keyof ToggleOwnProps
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-disabled"
    | "data-uiify-toggle"
    | "id"
  >;
