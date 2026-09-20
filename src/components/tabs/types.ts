import type { ReactNode } from "react";
import type { ChoicePanelItem, ChoiceOrientation } from "../internal/choice-family/types.js";

export interface TabsStore {
  readonly getValue: () => string | undefined;
  readonly isSelected: (itemValue: string) => boolean;
  readonly setValue: (next: string | undefined) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly subscribeItem: (itemValue: string, listener: () => void) => () => void;
}

export interface TabsItem extends ChoicePanelItem {}

export interface TabsProps {
  readonly id: string;
  readonly items: readonly TabsItem[];
  readonly defaultValue?: string;
  readonly orientation?: ChoiceOrientation;
  readonly className?: string;
  /** Optional control rendered at the end of the tab bar. */
  readonly append?: ReactNode;
}
