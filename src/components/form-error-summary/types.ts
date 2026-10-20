import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface FormErrorSummaryError {
  readonly href: string;
  readonly message: ReactNode;
}

export interface FormErrorSummaryOwnProps {
  readonly title: ReactNode;
  readonly errors: readonly FormErrorSummaryError[];
}

export type FormErrorSummaryProps<TAs extends ElementType = "section"> = RenderableProps<
  TAs,
  FormErrorSummaryOwnProps,
  Record<string, never>,
  HTMLElement
>;
