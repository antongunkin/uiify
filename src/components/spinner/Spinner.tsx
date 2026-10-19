import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { PolymorphicProps } from "@gunkin/uiify/core/render";
import type { SpinnerLabels, SpinnerOwnProps, SpinnerProps } from "./types.js";

const DEFAULT_SPINNER_LABELS: SpinnerLabels = { loading: "Loading" };

export function Spinner<TAs extends ElementType = "div">(
  props: SpinnerProps<TAs>,
): ReactElement | null {
  const {
    as,
    align,
    render,
    delay = 0,
    label,
    labels,
    showLabel = false,
    size = "md",
    children,
    ...consumerProps
  } = props as PolymorphicProps<"div", SpinnerOwnProps>;

  const visible = delay === 0;
  const resolvedLabel = label ?? labels?.loading ?? DEFAULT_SPINNER_LABELS.loading;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "aria-label": resolvedLabel,
      "aria-live": "polite",
      "data-align": align,
      "data-delay": delay > 0 ? `${delay}ms` : undefined,
      "data-size": size,
      "data-state": visible ? "visible" : "delayed",
      "data-uiify-spinner": "",
      role: "status",
      children: (
        <>
          {showLabel ? <span data-part="label">{resolvedLabel}</span> : null}
          {children}
        </>
      ),
    },
    render,
    state: { visible },
  });
}
Spinner.displayName = "Spinner";
