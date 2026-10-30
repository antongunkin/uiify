import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { SlotProps, RepeatedSlotProps } from "../../core/slot-props.js";

export interface FormErrorSummaryError {
  readonly href: string;
  readonly message: ReactNode;
}

export interface FormErrorSummarySlotProps {
  readonly title?: SlotProps<"h2">;
  readonly list?: SlotProps<"ul">;
  /** Repeated error props may target an error by its stable href value. */
  readonly item?: RepeatedSlotProps<SlotProps<"li">>;
  readonly link?: RepeatedSlotProps<SlotProps<"a">>;
}

export interface FormErrorSummaryOwnProps {
  readonly title: ReactNode;
  readonly errors: readonly FormErrorSummaryError[];
  readonly slotProps?: FormErrorSummarySlotProps;
}

export type FormErrorSummaryProps<TAs extends ElementType = "section"> = RenderableProps<
  TAs,
  FormErrorSummaryOwnProps,
  Record<string, never>,
  HTMLElement
>;
