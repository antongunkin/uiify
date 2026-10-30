import type { ElementType, ReactNode } from "react";
import type { SlotProps } from "../../core/slot-props.js";
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

export type AlertSymbolSlotProps = SlotProps<"span">;

export interface AlertSlotProps {
  readonly symbol?: AlertSymbolSlotProps;
}
