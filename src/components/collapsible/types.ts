import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";

type CollapsibleTriggerOwnedAttributes = {
  readonly "aria-disabled"?: never;
  readonly "data-part"?: never;
  readonly "data-uiify-details"?: never;
  readonly disabled?: never;
  readonly part?: never;
  readonly tabIndex?: never;
};

type CollapsiblePanelOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-details"?: never;
  readonly part?: never;
};

export type CollapsibleTriggerSlotProps = Omit<
  ComponentPropsWithRef<"summary">,
  | "aria-disabled"
  | "children"
  | "dangerouslySetInnerHTML"
  | "data-part"
  | "data-uiify-details"
  | "disabled"
  | "part"
  | "tabIndex"
> &
  CollapsibleTriggerOwnedAttributes &
  ConsumerDataAttributes;

export type CollapsiblePanelSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-details" | "part"
> &
  CollapsiblePanelOwnedAttributes &
  ConsumerDataAttributes;

export interface CollapsibleSlotProps {
  readonly trigger?: CollapsibleTriggerSlotProps;
  readonly panel?: CollapsiblePanelSlotProps;
}

export interface CollapsibleOwnProps {
  readonly id: string;
  readonly label: ReactNode;
  readonly content: ReactNode;
  readonly defaultOpen?: boolean;
  readonly disabled?: boolean;
  readonly slotProps?: CollapsibleSlotProps;
}

export type CollapsibleProps = CollapsibleOwnProps &
  Omit<
    ComponentPropsWithRef<"details">,
    | keyof CollapsibleOwnProps
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-disabled"
    | "data-uiify-collapsible"
    | "data-uiify-details"
    | "open"
    | "name"
  >;
