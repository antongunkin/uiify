import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { FieldsetLegendProps, FieldsetRootProps } from "./types.js";

export function Fieldset<TAs extends ElementType = "fieldset">(
  props: FieldsetRootProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as FieldsetRootProps<"fieldset">;

  return useRenderElement({
    as,
    defaultTag: "fieldset",
    props: {
      ...consumerProps,
      children,
      "data-uiify-fieldset": "",
      "data-part": "root",
    },
    render,
    state: {},
  });
}

Fieldset.displayName = "Fieldset";

export function FieldsetLegend<TAs extends ElementType = "legend">(
  props: FieldsetLegendProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as FieldsetLegendProps<"legend">;

  return useRenderElement({
    as,
    defaultTag: "legend",
    props: {
      ...consumerProps,
      children,
      "data-uiify-fieldset-legend": "",
      "data-part": "legend",
    },
    render,
    state: {},
  });
}

FieldsetLegend.displayName = "FieldsetLegend";
