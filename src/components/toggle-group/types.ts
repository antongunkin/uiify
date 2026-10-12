import type { ChoiceItem, ChoiceOrientation } from "../internal/choice-family/types.js";

export type ToggleGroupItem = ChoiceItem;

export interface ToggleGroupProps {
  readonly id: string;
  readonly type?: "single" | "multiple";
  readonly items: readonly ToggleGroupItem[];
  readonly defaultValue?: string | readonly string[];
  readonly disabled?: boolean;
  readonly orientation?: ChoiceOrientation;
  /** Button size of each item; `md` metrics when omitted. */
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
}

export interface ToggleGroupClientProps extends ToggleGroupProps {
  readonly value?: string | readonly string[];
  readonly onValueChange?: (value: string | readonly string[]) => void;
}
