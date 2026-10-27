import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";
import type { ChoicePanelItem, ChoiceOrientation } from "../internal/choice-family/types.js";

export interface TabsStore {
  readonly getValue: () => string | undefined;
  readonly isSelected: (itemValue: string) => boolean;
  readonly setValue: (next: string | undefined) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly subscribeItem: (itemValue: string, listener: () => void) => () => void;
}

export interface TabsItem extends ChoicePanelItem {}

type TabsItemOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-choice"?: never;
  readonly "data-uiify-tabs"?: never;
};

type TabsControlOwnedAttributes = TabsItemOwnedAttributes & {
  readonly "data-uiify-radio"?: never;
};

type TabsPartOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-tabs"?: never;
};

export type TabsItemSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"div">,
    "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-choice" | "data-uiify-tabs"
  >,
  TabsItemOwnedAttributes
>;

export type TabsInputSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"input">,
    | "aria-labelledby"
    | "checked"
    | "defaultChecked"
    | "disabled"
    | "id"
    | "name"
    | "type"
    | "value"
    | "data-part"
    | "data-uiify-choice"
    | "data-uiify-radio"
    | "data-uiify-tabs"
  >,
  TabsControlOwnedAttributes
>;

export type TabsTriggerSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"label">,
    "children" | "dangerouslySetInnerHTML" | "htmlFor" | "id" | "data-part" | "data-uiify-tabs"
  >,
  TabsPartOwnedAttributes
>;

export type TabsPanelSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"div">,
    "children" | "dangerouslySetInnerHTML" | "id" | "data-part" | "data-uiify-tabs"
  >,
  TabsPartOwnedAttributes
>;

export interface TabsSlotProps {
  readonly item?: TabsItemSlotProps;
  readonly input?: TabsInputSlotProps;
  readonly trigger?: TabsTriggerSlotProps;
  readonly panel?: TabsPanelSlotProps;
  readonly append?: Omit<
    ComponentPropsWithRef<"div">,
    "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-tabs"
  > &
    ConsumerDataAttributes &
    TabsPartOwnedAttributes;
}

export interface TabsOwnProps {
  readonly id: string;
  readonly items: readonly TabsItem[];
  readonly defaultValue?: string;
  readonly orientation?: ChoiceOrientation;
  /** Optional control rendered at the end of the tab bar. */
  readonly append?: ReactNode;
  readonly slotProps?: TabsSlotProps;
}

export type TabsProps = TabsOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    | keyof TabsOwnProps
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-uiify-choice"
    | "data-uiify-tabs"
  >;
