import type { ReactNode } from "react";

export interface ChoiceItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
}

export interface ChoicePanelItem extends ChoiceItem {
  readonly panel?: ReactNode;
}

export type ChoiceOrientation = "horizontal" | "vertical";

/** "single" renders `type="radio"` and a plain group name; "multiple" renders
 * `type="checkbox"` and suffixes the group name (see `getChoiceGroupName`). */
export type ChoiceGroupKind = "single" | "multiple";

export interface ChoiceGroupProps<TItem extends ChoiceItem = ChoiceItem> {
  readonly id: string;
  readonly items: readonly TItem[];
  readonly namespace: string;
  readonly kind: ChoiceGroupKind;
  readonly isChecked: (item: TItem) => boolean;
  readonly isControlled?: boolean;
  /** Overrides the derived `getChoiceGroupName(id, kind)` group name. */
  readonly name?: string;
  readonly orientation: ChoiceOrientation;
  readonly className?: string;
  /** Part name for each item's wrapper div. Defaults to "item" (Stepper uses "step"). */
  readonly itemPart?: string;
  /** Adds `data-part="label"` to the label. */
  readonly labelPart?: boolean;
  /** Adds `data-uiify-<namespace>-input` to the input. */
  readonly withInputAttribute?: boolean;
  /** Adds `data-uiify-<namespace>-trigger` to the label. */
  readonly withTriggerAttribute?: boolean;
  /** Extra attributes spread onto the root, e.g. `data-full-width`, `aria-label`. */
  readonly rootAttributes?: Record<string, string | undefined>;
  /** Extra attributes spread onto each item's wrapper div, e.g. Stepper's `data-complete`. */
  readonly itemWrapperAttributes?: (item: TItem) => Record<string, string | undefined>;
  /** Per-item `className` hook for the input, e.g. RadioGroup's `item.className`. */
  readonly itemInputClassName?: (item: TItem) => string | undefined;
  /** Fires on the input's native `change` event, e.g. a client wrapper syncing
   * a controlled value. Omitted by every uncontrolled (server) consumer. */
  readonly onItemChange?: (item: TItem) => void;
  /** Renders the panel content and its wrapper when given; omitted entirely otherwise. */
  readonly renderPanel?: (item: TItem) => ReactNode;
  /** Overrides the default `item.label` content, e.g. Stepper's label + description. */
  readonly renderLabel?: (item: TItem) => ReactNode;
  /** Trailing content rendered inside the root after the mapped items, e.g. Tabs' `append`. */
  readonly append?: ReactNode;
}
