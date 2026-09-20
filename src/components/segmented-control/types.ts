import type { ChoiceItem, ChoiceOrientation } from "../internal/choice-family/types.js";

export interface SegmentedControlItem extends ChoiceItem {}

export interface SegmentedControlProps {
  readonly id: string;
  readonly items: readonly SegmentedControlItem[];
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly orientation?: ChoiceOrientation;
  readonly fullWidth?: boolean;
  readonly className?: string;
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
}

export interface SegmentedControlClientProps extends SegmentedControlProps {
  readonly value?: string;
  readonly onChange?: (value: string) => void;
}
