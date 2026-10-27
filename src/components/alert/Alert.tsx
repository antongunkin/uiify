import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { omitProps } from "../../core/slot-props.js";
import type { AlertDescriptionProps, AlertProps, AlertTitleProps } from "./types.js";

const symbols = { secondary: "ⓘ", success: "✓", warning: "⚠︎", destructive: "×" };

export function Alert<TAs extends ElementType = "div">(
  props: AlertProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    variant = "secondary",
    symbol = symbols[variant],
    slotProps,
    children,
    ...consumerProps
  } = props as AlertProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-uiify-alert": "",
      "data-variant": variant,
      children: (
        <>
          {symbol !== false && (
            <span
              {...omitProps(slotProps?.symbol, ["aria-hidden", "data-part", "data-uiify-alert"])}
              data-part="symbol"
              aria-hidden="true"
            >
              {symbol}
            </span>
          )}
          {children}
        </>
      ),
    },
    render,
    state: {},
  });
}

Alert.displayName = "Alert";

export function AlertTitle<TAs extends ElementType = "div">(
  props: AlertTitleProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as AlertTitleProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, "data-uiify-alert-title": "", "data-part": "title" },
    render,
    state: {},
  });
}

export function AlertDescription<TAs extends ElementType = "div">(
  props: AlertDescriptionProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as AlertDescriptionProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      "data-uiify-alert-description": "",
      "data-part": "description",
    },
    render,
    state: {},
  });
}

AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";
