import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface TextareaOwnProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly autoSize?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
}

export type TextareaProps<TAs extends ElementType = "textarea"> = RenderableProps<
  TAs,
  TextareaOwnProps,
  TextareaOwnProps,
  HTMLTextAreaElement
>;
