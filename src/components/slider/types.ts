import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { RepeatedSlotProps, SlotProps } from "../../core/slot-props.js";

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
  readonly labels?: Partial<SliderLabels>;
  readonly thumbLabels?: readonly [string, string];
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
  readonly slotProps?: SliderClientSlotProps;
}

type SliderMarkSlotProps = RepeatedSlotProps<SlotProps<"span">> & {
  /** Use the rendered mark index to customize records that share one numeric value. */
  readonly byItemIndex?: Readonly<Record<number, SlotProps<"span">>>;
};

export interface SliderClientSlotProps {
  readonly track?: SlotProps<"div">;
  readonly range?: SliderClientPartSlotProps<"span">;
  readonly mark?: SliderMarkSlotProps;
  readonly visualThumb?: RepeatedSlotProps<SlotProps<"span">>;
  readonly input?: RepeatedSlotProps<SlotProps<"input">>;
}

export type SliderClientPartSlotProps<TTag extends ElementType> = SlotProps<TTag>;

export interface SliderLabels {
  readonly minimum: string;
  readonly maximum: string;
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
