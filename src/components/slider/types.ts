import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SliderOwnProps {
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onValueChange?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
}

export type SliderProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  SliderOwnProps,
  SliderOwnProps,
  HTMLInputElement
>;
