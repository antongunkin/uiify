import type { ComponentPropsWithRef } from "react";
import type { ChoicePanelItem } from "../internal/choice-family/types.js";
import type { RepeatedSlotProps } from "../../core/slot-props.js";

export type AccordionType = "single" | "multiple";

export interface AccordionItem extends ChoicePanelItem {}

type AccordionOwnedSlotAttributes = {
  readonly name?: never;
  readonly open?: never;
  readonly disabled?: never;
  readonly part?: never;
  readonly "data-part"?: never;
  readonly "data-uiify-details"?: never;
  readonly "data-uiify-accordion"?: never;
};

export type AccordionItemSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"details">,
    | "name"
    | "open"
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-part"
    | "data-uiify-details"
    | "data-uiify-accordion"
    | "disabled"
  >,
  AccordionOwnedSlotAttributes
>;

export type AccordionTriggerSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"summary">,
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-part"
    | "data-uiify-details"
    | "data-uiify-accordion"
    | "disabled"
    | "part"
  >,
  AccordionOwnedSlotAttributes
>;

export type AccordionPanelSlotProps = RepeatedSlotProps<
  Omit<
    ComponentPropsWithRef<"div">,
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-part"
    | "data-uiify-details"
    | "data-uiify-accordion"
    | "part"
  >,
  AccordionOwnedSlotAttributes
>;

export interface AccordionSlotProps {
  readonly item?: AccordionItemSlotProps;
  readonly trigger?: AccordionTriggerSlotProps;
  readonly panel?: AccordionPanelSlotProps;
}

export interface AccordionOwnProps {
  readonly id: string;
  readonly items: readonly AccordionItem[];
  readonly type?: AccordionType;
  readonly defaultValue?: string | readonly string[];
  readonly slotProps?: AccordionSlotProps;
}

export type AccordionProps = AccordionOwnProps &
  Omit<
    ComponentPropsWithRef<"div">,
    keyof AccordionOwnProps | "children" | "dangerouslySetInnerHTML" | "data-uiify-accordion"
  >;
