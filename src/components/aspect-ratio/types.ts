import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";
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

export type AspectRatioContentSlotProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-aspect-ratio"
> & {
  readonly "data-part"?: never;
  readonly "data-uiify-aspect-ratio"?: never;
} & ConsumerDataAttributes;

export interface AspectRatioSlotProps {
  readonly content?: AspectRatioContentSlotProps;
}
