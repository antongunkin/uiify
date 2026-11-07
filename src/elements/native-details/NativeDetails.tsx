import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import type {
  NativeDetailsContentProps,
  NativeDetailsRootProps,
  NativeDetailsSummaryProps,
} from "./types.js";

/**
 * A native disclosure. `name` is what makes a group of these single-open with zero JS — the
 * browser enforces the exclusivity. Renders the `uiify-native-details` class, plus `data-disabled` when
 * `disabled`.
 */
export function NativeDetailsRoot(props: NativeDetailsRootProps): ReactElement {
  const { children, className, defaultOpen, disabled, ...consumerProps } = props;
  return (
    <details
      data-disabled={disabled ? "" : undefined}
      {...(defaultOpen ? { open: true } : {})}
      {...consumerProps}
      className={cn("uiify-native-details", className)}
    >
      {children}
    </details>
  );
}
NativeDetailsRoot.displayName = "NativeDetailsRoot";

/**
 * The disclosure trigger; the component built on it names it with its own class.
 * When `disabled`, the trigger loses focusability and gets `aria-disabled` — the browser has
 * no native `disabled` state for `<summary>`.
 */
export function NativeDetailsSummary(props: NativeDetailsSummaryProps): ReactElement {
  const { children, disabled, ...consumerProps } = props;
  return (
    <summary {...(disabled ? { "aria-disabled": "true", tabIndex: -1 } : {})} {...consumerProps}>
      {children}
    </summary>
  );
}
NativeDetailsSummary.displayName = "NativeDetailsSummary";

/**
 * The disclosure body. Polymorphic (`as`/`render`) since the content isn't always a `<div>` —
 * breadcrumb's ellipsis panel is an `<ol>`. The component built on it names it with its own class.
 */
export function NativeDetailsContent<TAs extends ElementType = "div">(
  props: NativeDetailsContentProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as NativeDetailsContentProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: consumerProps,
    render,
    state: {},
  });
}
NativeDetailsContent.displayName = "NativeDetailsContent";

export const NativeDetails = {
  Root: NativeDetailsRoot,
  Summary: NativeDetailsSummary,
  Content: NativeDetailsContent,
};
