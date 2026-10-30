import type { ElementType, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface AspectRatioOwnProps {
  /** Positive finite width / height ratio. Omit to use the CSS default (square). */
  readonly ratio?: number;
  readonly children?: ReactNode;
  readonly slotProps?: AspectRatioSlotProps;
}

export type AspectRatioProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  AspectRatioOwnProps,
  Record<string, never>,
  HTMLElement
>;

export type AspectRatioContentSlotProps = SlotProps<"div">;

export interface AspectRatioSlotProps {
  readonly content?: AspectRatioContentSlotProps;
}
