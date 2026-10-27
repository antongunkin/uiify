import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type AlertVariant = "secondary" | "success" | "warning" | "destructive";

export interface AlertOwnProps {
  readonly children?: ReactNode;
  /** Visual status. Defaults to secondary without adding a live role. */
  readonly variant?: AlertVariant;
  /** Override the decorative text symbol, or hide it with false. */
  readonly symbol?: string | false;
  readonly slotProps?: AlertSlotProps;
}

export type AlertProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  AlertOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface AlertTitleOwnProps {
  readonly children?: ReactNode;
}

export type AlertTitleProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  AlertTitleOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface AlertDescriptionOwnProps {
  readonly children?: ReactNode;
}

export type AlertDescriptionProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  AlertDescriptionOwnProps,
  Record<string, never>,
  HTMLElement
>;

export type AlertSymbolSlotProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-hidden" | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-alert"
> & {
  readonly "aria-hidden"?: never;
  readonly "data-part"?: never;
  readonly "data-uiify-alert"?: never;
} & ConsumerDataAttributes;

export interface AlertSlotProps {
  readonly symbol?: AlertSymbolSlotProps;
}
