import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";

export interface InputOwnProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
}

export type InputProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  InputOwnProps,
  InputOwnProps,
  HTMLInputElement
>;
