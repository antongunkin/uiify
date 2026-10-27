import type { ReactElement } from "react";
import { omitProps } from "../../core/slot-props.js";
import { DetailsContent, DetailsRoot, DetailsSummary } from "../../elements/details/index.js";
import type { CollapsibleProps } from "./types.js";

/**
 * Built on `@gunkin/uiify/elements/details`: `Details.Root`/`Details.Summary` already own
 * `data-disabled`/`aria-disabled`/`tabIndex` from their own `disabled` prop; this component
 * adds only its own `data-uiify-collapsible` marker and `data-part` values.
 */
export function Collapsible({
  id,
  label,
  content,
  defaultOpen = false,
  disabled = false,
  slotProps,
  ...rootProps
}: CollapsibleProps): ReactElement {
  return (
    <DetailsRoot
      {...omitProps(rootProps, [
        "children",
        "dangerouslySetInnerHTML",
        "data-disabled",
        "data-uiify-collapsible",
        "data-uiify-details",
        "open",
      ])}
      data-uiify-collapsible=""
      defaultOpen={defaultOpen}
      disabled={disabled}
      id={id}
    >
      <DetailsSummary
        {...omitProps(slotProps?.trigger, [
          "aria-disabled",
          "data-part",
          "data-uiify-details",
          "disabled",
          "part",
          "tabIndex",
        ])}
        disabled={disabled}
        part="trigger"
      >
        {label}
      </DetailsSummary>
      <DetailsContent
        {...omitProps(slotProps?.panel, ["data-part", "data-uiify-details", "part"])}
        part="panel"
      >
        {content}
      </DetailsContent>
    </DetailsRoot>
  );
}
Collapsible.displayName = "Collapsible";
