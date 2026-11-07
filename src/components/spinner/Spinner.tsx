import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement, type PolymorphicProps } from "@gunkin/uiify/core/render";
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
    value,
    slotProps,
    children,
    ...consumerProps
  } = props as PolymorphicProps<"div", SpinnerOwnProps>;

  const visible = delay === 0;
  const determinate = value !== undefined;
  const percent = determinate ? Math.min(100, Math.max(0, value)) : undefined;
  const resolvedLabel = label ?? labels?.loading ?? DEFAULT_SPINNER_LABELS.loading;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      "aria-label": resolvedLabel,
      "aria-live": determinate ? undefined : "polite",
      "aria-valuemax": determinate ? 100 : undefined,
      "aria-valuemin": determinate ? 0 : undefined,
      "aria-valuenow": percent,
      "data-align": align,
      "data-delay": delay > 0 ? `${delay}ms` : undefined,
      "data-size": size,
      "data-state": visible ? "visible" : "delayed",
      "data-value": percent,
      role: determinate ? "progressbar" : "status",
      ...consumerProps,
      className: cn(
        "uiify-spinner",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children: (
        <>
          {showLabel ? (
            <span
              {...slotProps?.label}
              className={cn("uiify-spinner-label", slotProps?.label?.className)}
            >
              {resolvedLabel}
            </span>
          ) : null}
          {children}
        </>
      ),
    },
    render,
    state: { visible },
  });
}
Spinner.displayName = "Spinner";
