import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SwitchOwnProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly disabled?: boolean;
}

export type SwitchProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  SwitchOwnProps,
  SwitchOwnProps,
  HTMLInputElement
>;
