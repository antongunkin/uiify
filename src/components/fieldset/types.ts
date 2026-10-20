import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface FieldsetRootOwnProps {
  readonly children?: ReactNode;
}

export type FieldsetRootProps<TAs extends ElementType = "fieldset"> = RenderableProps<
  TAs,
  FieldsetRootOwnProps,
  Record<string, never>,
  HTMLFieldSetElement
>;

export interface FieldsetLegendOwnProps {
  readonly children?: ReactNode;
}

export type FieldsetLegendProps<TAs extends ElementType = "legend"> = RenderableProps<
  TAs,
  FieldsetLegendOwnProps,
  Record<string, never>,
  HTMLLegendElement
>;
