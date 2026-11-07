import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
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
  const symbolProps = slotProps?.symbol;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      "data-variant": variant,
      ...consumerProps,
      className: cn("uiify-alert", (consumerProps as { className?: string }).className),
      children: (
        <>
          {symbol !== false && (
            <span
              aria-hidden="true"
              {...symbolProps}
              className={cn("uiify-alert-symbol", symbolProps?.className)}
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
    props: {
      ...consumerProps,
      className: cn("uiify-alert-title", (consumerProps as { className?: string }).className),
    },
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
      className: cn("uiify-alert-description", (consumerProps as { className?: string }).className),
    },
    render,
    state: {},
  });
}

AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";
