import type { ReactElement } from "react";
import { DetailsContent, DetailsRoot, DetailsSummary } from "../../elements/details/index.js";
import type { CollapsibleProps } from "./types.js";

/** Native disclosure defaults remain replaceable through root and generated-part props. */
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
      data-uiify-collapsible=""
      defaultOpen={defaultOpen}
      disabled={disabled}
      id={id}
      {...rootProps}
    >
      <DetailsSummary disabled={disabled} part="trigger" {...slotProps?.trigger}>
        {label}
      </DetailsSummary>
      <DetailsContent part="panel" {...slotProps?.panel}>
        {content}
      </DetailsContent>
    </DetailsRoot>
  );
}
Collapsible.displayName = "Collapsible";
