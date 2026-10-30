import type { ComponentPropsWithRef, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";
import type {
  ChoiceGroupSlotProps,
  ChoiceOrientation,
  ChoicePanelItem,
} from "../internal/choice-family/types.js";

export interface TabsStore {
  readonly getValue: () => string | undefined;
  readonly isSelected: (itemValue: string) => boolean;
  readonly setValue: (next: string | undefined) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly subscribeItem: (itemValue: string, listener: () => void) => () => void;
}

export interface TabsItem extends ChoicePanelItem {}

export type TabsItemSlotProps = NonNullable<ChoiceGroupSlotProps["item"]>;
export type TabsInputSlotProps = NonNullable<ChoiceGroupSlotProps["input"]>;
export type TabsTriggerSlotProps = NonNullable<ChoiceGroupSlotProps["label"]>;
export type TabsPanelSlotProps = NonNullable<ChoiceGroupSlotProps["panel"]>;

export interface TabsSlotProps {
  readonly item?: TabsItemSlotProps;
  readonly input?: TabsInputSlotProps;
  readonly trigger?: TabsTriggerSlotProps;
  readonly panel?: TabsPanelSlotProps;
  readonly append?: SlotProps<"div">;
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
  Omit<ComponentPropsWithRef<"div">, keyof TabsOwnProps | "children" | "dangerouslySetInnerHTML">;
