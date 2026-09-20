import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type ValidationBehavior = "native" | "aria";

export interface FormOwnProps {
  readonly validationBehavior?: ValidationBehavior;
}

export type FormProps<TAs extends ElementType = "form"> = RenderableProps<
  TAs,
  FormOwnProps,
  FormOwnProps,
  HTMLFormElement
>;
