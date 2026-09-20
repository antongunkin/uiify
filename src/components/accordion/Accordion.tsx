import type { ReactElement } from "react";
import { DetailsContent, DetailsRoot, DetailsSummary } from "../../elements/details/index.js";
import type { AccordionProps, AccordionType } from "./types.js";

function isDefaultOpen(
  type: AccordionType,
  defaultValue: string | readonly string[] | undefined,
  itemValue: string,
): boolean {
  if (type === "single") return defaultValue === itemValue;
  return Array.isArray(defaultValue) && defaultValue.includes(itemValue);
}

/**
 * Built on `@gunkin/uiify/elements/details`: `Details.Root` already owns `data-disabled` (from its own
 * `disabled` prop) and `data-uiify-details`; `Details.Summary`'s `disabled` prop already owns
 * `aria-disabled`/`tabIndex`. This component adds its own `data-part`/`data-uiify-accordion-*`
 * markers and the `name`/`defaultOpen` wiring that makes single-select exclusive.
 */
export function Accordion({
  id,
  items,
  type = "single",
  defaultValue,
  className,
}: AccordionProps): ReactElement {
  return (
    <div className={className} data-uiify-accordion="" data-uiify-choice-kind={type}>
      {items.map((item) => (
        <DetailsRoot
          data-part="item"
          data-uiify-accordion-item=""
          defaultOpen={isDefaultOpen(type, defaultValue, item.value)}
          disabled={item.disabled ?? false}
          key={item.value}
          {...(type === "single" ? { name: id } : {})}
        >
          <DetailsSummary disabled={item.disabled ?? false} part="trigger">
            {item.label}
          </DetailsSummary>
          <DetailsContent part="panel">{item.panel}</DetailsContent>
        </DetailsRoot>
      ))}
    </div>
  );
}
Accordion.displayName = "Accordion";
