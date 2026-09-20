import type { ReactNode } from "react";
import type { ChoicePanelItem, ChoiceOrientation } from "../internal/choice-family/types.js";

export interface StepperItem extends ChoicePanelItem {
  readonly description?: ReactNode;
  readonly complete?: boolean;
}

export interface StepperProps {
  readonly id: string;
  readonly items: readonly StepperItem[];
  readonly defaultValue?: string;
  readonly orientation?: ChoiceOrientation;
  readonly className?: string;
}
