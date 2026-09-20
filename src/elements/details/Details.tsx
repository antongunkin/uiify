import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { DetailsContentProps, DetailsRootProps, DetailsSummaryProps } from "./types.js";

/**
 * A native disclosure. `name` is what makes a group of these single-open with zero JS — the
 * browser enforces the exclusivity. Emits `data-uiify-details`, plus `data-disabled` when
 * `disabled`.
 */
export function DetailsRoot(props: DetailsRootProps): ReactElement {
  const { children, defaultOpen, disabled, name, ...consumerProps } = props;
  return (
    <details
      {...consumerProps}
      data-disabled={disabled ? "" : undefined}
      data-uiify-details=""
      {...(name === undefined ? {} : { name })}
      {...(defaultOpen ? { open: true } : {})}
    >
      {children}
    </details>
  );
}
DetailsRoot.displayName = "DetailsRoot";

/**
 * The disclosure trigger. `part` sets `data-part` when given (omitted entirely otherwise —
 * not every consumer wants a part name on this element, see breadcrumb's ellipsis trigger).
 * When `disabled`, the trigger loses focusability and gets `aria-disabled` — the browser has
 * no native `disabled` state for `<summary>`.
 */
export function DetailsSummary(props: DetailsSummaryProps): ReactElement {
  const { children, disabled, part, ...consumerProps } = props;
  return (
    <summary
      {...consumerProps}
      {...(part === undefined ? {} : { "data-part": part })}
      {...(disabled ? { "aria-disabled": "true", tabIndex: -1 } : {})}
    >
      {children}
    </summary>
  );
}
DetailsSummary.displayName = "DetailsSummary";

/**
 * The disclosure body. Polymorphic (`as`/`render`) since the content isn't always a `<div>` —
 * breadcrumb's ellipsis panel is an `<ol>`. `part` sets `data-part` when given, same rule as
 * `DetailsSummary`.
 */
export function DetailsContent<TAs extends ElementType = "div">(
  props: DetailsContentProps<TAs>,
): ReactElement | null {
  const { as, render, part, ...consumerProps } = props as DetailsContentProps<"div">;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: { ...consumerProps, ...(part === undefined ? {} : { "data-part": part }) },
    render,
    state: {},
  });
}
DetailsContent.displayName = "DetailsContent";

export const Details = {
  Root: DetailsRoot,
  Summary: DetailsSummary,
  Content: DetailsContent,
};
