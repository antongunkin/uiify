import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface SliderMark {
  readonly value: number;
  readonly label?: ReactNode;
}

export interface SliderOwnProps {
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onValueChange?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
}

export type SliderClientValue = number | readonly [number, number];

export interface SliderClientOwnProps {
  readonly value?: SliderClientValue;
  readonly defaultValue?: SliderClientValue;
  readonly onValueChange?: (value: SliderClientValue) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number | null;
  readonly disabled?: boolean;
  readonly orientation?: "horizontal" | "vertical";
  readonly marks?: readonly SliderMark[];
  readonly thumbLabels?: readonly [string, string];
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
}

export interface SliderClientRenderState {
  readonly disabled: boolean;
  readonly orientation: "horizontal" | "vertical";
  readonly value: SliderClientValue;
}

export type SliderClientProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SliderClientOwnProps,
  SliderClientRenderState,
  HTMLDivElement
>;

export type SliderProps<TAs extends ElementType = "input"> = RenderableProps<
  TAs,
  SliderOwnProps,
  SliderOwnProps,
  HTMLInputElement
>;
