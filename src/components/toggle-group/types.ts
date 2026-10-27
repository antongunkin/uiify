import type {
  ChoiceGroupRootProps,
  ChoiceOptionSlotProps,
  ChoiceItem,
  ChoiceOrientation,
} from "../internal/choice-family/types.js";

export type ToggleGroupSlotProps = ChoiceOptionSlotProps;

export type ToggleGroupItem = ChoiceItem;

export interface ToggleGroupProps extends ChoiceGroupRootProps {
  readonly id: string;
  readonly type?: "single" | "multiple";
  readonly items: readonly ToggleGroupItem[];
  readonly defaultValue?: string | readonly string[];
  readonly disabled?: boolean;
  readonly orientation?: ChoiceOrientation;
  /** Button size of each item; `md` metrics when omitted. */
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly slotProps?: ToggleGroupSlotProps;
}

export interface ToggleGroupClientProps extends ToggleGroupProps {
  readonly value?: string | readonly string[];
  readonly onValueChange?: (value: string | readonly string[]) => void;
}
