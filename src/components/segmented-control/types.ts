import type {
  ChoiceGroupRootProps,
  ChoiceOptionSlotProps,
  ChoiceItem,
  ChoiceOrientation,
} from "../internal/choice-family/types.js";

export type SegmentedControlSlotProps = ChoiceOptionSlotProps;

export interface SegmentedControlItem extends ChoiceItem {}

export interface SegmentedControlProps extends ChoiceGroupRootProps {
  readonly id: string;
  readonly items: readonly SegmentedControlItem[];
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly orientation?: ChoiceOrientation;
  readonly fullWidth?: boolean;
  readonly className?: string;
  readonly slotProps?: SegmentedControlSlotProps;
}

export interface SegmentedControlClientProps extends SegmentedControlProps {
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
}
