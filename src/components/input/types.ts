import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface InputOwnProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
}

export type InputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  InputOwnProps,
  InputOwnProps,
  HTMLInputElement
>;
