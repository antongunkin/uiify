// API informed by shadcn/ui public documentation (names and props only).
import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type { FieldLegendProps, FieldSetProps } from "./types.js";

export function FieldSet<TAs extends ElementType = "fieldset">(
  props: FieldSetProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as FieldSetProps<"fieldset">;

  return useRenderElement({
    as,
    defaultTag: "fieldset",
    props: {
      ...consumerProps,
      className: cn("uiify-field-set", consumerProps.className),
      children,
    },
    render,
    state: {},
  });
}

export function FieldLegend<TAs extends ElementType = "legend">(
  props: FieldLegendProps<TAs>,
): ReactElement | null {
  const { as, render, children, variant, ...consumerProps } = props as FieldLegendProps<"legend">;

  return useRenderElement({
    as,
    defaultTag: "legend",
    props: {
      ...(variant !== undefined ? { "data-variant": variant } : {}),
      ...consumerProps,
      className: cn("uiify-field-set-legend", consumerProps.className),
      children,
    },
    render,
    state: {},
  });
}
