import type { ReactElement } from "react";
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
  className,
}: CollapsibleProps): ReactElement {
  return (
    <DetailsRoot
      className={className}
      data-uiify-collapsible=""
      defaultOpen={defaultOpen}
      disabled={disabled}
      id={id}
    >
      <DetailsSummary disabled={disabled} part="trigger">
        {label}
      </DetailsSummary>
      <DetailsContent part="panel">{content}</DetailsContent>
    </DetailsRoot>
  );
}
Collapsible.displayName = "Collapsible";
