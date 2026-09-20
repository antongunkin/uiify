import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { PolymorphicProps } from "@gunkin/uiify/core/render";
import type { SpinnerOwnProps, SpinnerProps } from "./types.js";

export function Spinner<TAs extends ElementType = "div">(
  props: SpinnerProps<TAs>,
): ReactElement | null {
  const {
    as,
    align,
    render,
    delay = 0,
    label = "Loading",
    labelClassName,
    size = "default",
    children,
    ...consumerProps
  } = props as PolymorphicProps<"div", SpinnerOwnProps>;

  const visible = delay === 0;

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "aria-label": label,
      "aria-live": "polite",
      "data-align": align,
      "data-delay": delay > 0 ? `${delay}ms` : undefined,
      "data-size": size,
      "data-state": visible ? "visible" : "delayed",
      "data-uiify-spinner": "",
      role: "status",
      children: (
        <>
          {labelClassName ? (
            <span className={labelClassName} data-part="label" data-uiify-spinner-label="">
              {label}
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
