import type { ComponentPropsWithRef, ReactNode } from "react";
import type {
  ConsumerDataAttributes,
  RepeatedSlotProps,
  SlotProps,
} from "../../../core/slot-props.js";
import type {
  ChoiceInputSlotProps,
  ChoiceItemOwnProps,
  ChoiceLabelSlotProps,
  ChoicePanelSlotProps,
} from "../../../elements/choice/types.js";

type ChoiceItemWrapperSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  keyof ChoiceItemOwnProps | "children" | "dangerouslySetInnerHTML"
> &
  ConsumerDataAttributes;

export interface ChoiceGroupSlotProps {
  readonly item?: RepeatedSlotProps<ChoiceItemWrapperSlotProps> | undefined;
  readonly input?: RepeatedSlotProps<ChoiceInputSlotProps> | undefined;
  readonly label?: RepeatedSlotProps<ChoiceLabelSlotProps> | undefined;
  readonly panel?: RepeatedSlotProps<ChoicePanelSlotProps> | undefined;
}

export type ChoiceOptionSlotProps = Omit<ChoiceGroupSlotProps, "panel">;

export interface ChoiceItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
}

export interface ChoicePanelItem extends ChoiceItem {
  readonly panel?: ReactNode;
}

export type ChoiceOrientation = "horizontal" | "vertical";

export type ChoiceGroupRootProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "className" | "dangerouslySetInnerHTML" | "id"
>;

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
  /** Native props forwarded to the rendered group root. */
  readonly rootProps?: Omit<
    ComponentPropsWithRef<"div">,
    "children" | "className" | "dangerouslySetInnerHTML" | "id"
  >;
  /** Part name for each item's wrapper div. Defaults to "item". */
  readonly itemPart?: string;
  /** Adds `data-part="label"` to the label. */
  readonly labelPart?: boolean;
  /** Extra attributes spread onto the root, e.g. `data-full-width`, `aria-label`. */
  readonly rootAttributes?: Record<string, string | undefined>;
  /** Extra attributes for each item's label, e.g. the Button skin markers. */
  readonly labelAttributes?: Record<string, string>;
  /** Per-item `className` hook for the input, e.g. RadioGroup's `item.className`. */
  readonly itemInputClassName?: (item: TItem) => string | undefined;
  /** Props for generated item parts. Repeated values can target one item by value. */
  readonly slotProps?: ChoiceGroupSlotProps;
  /** Fires on the input's native `change` event, e.g. a client wrapper syncing
   * a controlled value. Omitted by every uncontrolled (server) consumer. */
  readonly onItemChange?: (item: TItem) => void;
  /** Renders the panel content and its wrapper when given; omitted entirely otherwise. */
  readonly renderPanel?: (item: TItem) => ReactNode;
  /** Overrides the default `item.label` content, such as a label with a description. */
  readonly renderLabel?: (item: TItem) => ReactNode;
  /** Trailing content rendered inside the root after the mapped items, e.g. Tabs' `append`. */
  readonly append?: ReactNode;
  /** Props for the generated append wrapper. */
  readonly appendProps?: SlotProps<"div">;
}
