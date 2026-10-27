import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type SpinnerAlign = "center" | "fixed" | "absolute";
export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerLabels {
  readonly loading: string;
}

export interface SpinnerOwnProps {
  readonly align?: SpinnerAlign;
  readonly children?: ReactNode;
  readonly delay?: number;
  readonly label?: string;
  readonly labels?: Partial<SpinnerLabels>;
  readonly showLabel?: boolean;
  readonly size?: SpinnerSize;
  readonly value?: number;
  readonly slotProps?: SpinnerSlotProps;
}

export type SpinnerProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  SpinnerOwnProps,
  { visible: boolean },
  HTMLElement
>;

export type SpinnerLabelSlotProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-spinner"
> & {
  readonly "data-part"?: never;
  readonly "data-uiify-spinner"?: never;
} & ConsumerDataAttributes;

export interface SpinnerSlotProps {
  readonly label?: SpinnerLabelSlotProps;
}
