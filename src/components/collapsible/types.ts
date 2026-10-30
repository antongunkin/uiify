import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";

export type CollapsibleTriggerSlotProps = Omit<SlotProps<"summary">, "part">;

export type CollapsiblePanelSlotProps = Omit<SlotProps<"div">, "part">;

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
    keyof CollapsibleOwnProps | "children" | "dangerouslySetInnerHTML"
  >;
