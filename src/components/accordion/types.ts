import type { ChoicePanelItem } from "../internal/choice-family/types.js";

export type AccordionType = "single" | "multiple";

export interface AccordionItem extends ChoicePanelItem {}

export interface AccordionProps {
  readonly id: string;
  readonly items: readonly AccordionItem[];
  readonly type?: AccordionType;
  readonly defaultValue?: string | readonly string[];
  readonly className?: string;
}
