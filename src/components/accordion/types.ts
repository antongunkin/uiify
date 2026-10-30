import type { ComponentPropsWithRef } from "react";
import type { ChoicePanelItem } from "../internal/choice-family/types.js";
import type { RepeatedSlotProps, SlotProps } from "../../core/slot-props.js";

export type AccordionType = "single" | "multiple";

export interface AccordionItem extends ChoicePanelItem {}

/** Native props for each repeated details item. */
export type AccordionItemSlotProps = RepeatedSlotProps<SlotProps<"details">>;

export type AccordionTriggerSlotProps = RepeatedSlotProps<Omit<SlotProps<"summary">, "part">>;

export type AccordionPanelSlotProps = RepeatedSlotProps<Omit<SlotProps<"div">, "part">>;

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
    keyof AccordionOwnProps | "children" | "dangerouslySetInnerHTML"
  >;
