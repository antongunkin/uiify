import type { ReactNode } from "react";
import type {
  ChoiceGroupRootProps,
  ChoiceOptionSlotProps,
} from "../internal/choice-family/types.js";

export type RadioGroupSlotProps = ChoiceOptionSlotProps;

export interface RadioGroupItem {
  readonly value: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
}

export interface RadioGroupProps extends ChoiceGroupRootProps {
  readonly id: string;
  readonly items: readonly RadioGroupItem[];
  readonly defaultValue?: string;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly orientation?: "horizontal" | "vertical";
  readonly className?: string;
  readonly slotProps?: RadioGroupSlotProps;
}
