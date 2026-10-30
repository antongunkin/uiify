import type { ReactElement } from "react";
import { DetailsContent, DetailsRoot, DetailsSummary } from "../../elements/details/index.js";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
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
 * `aria-disabled`/`tabIndex`. This component adds its own identity/anatomy markers and the
 * `name`/`defaultOpen` wiring that makes single-select exclusive.
 */
export function Accordion({
  id,
  items,
  type = "single",
  defaultValue,
  slotProps,
  ...rootProps
}: AccordionProps): ReactElement {
  return (
    <div id={id} data-kind={type} data-uiify-accordion="" {...rootProps}>
      {items.map((item) => {
        const disabled = item.disabled ?? false;
        return (
          <DetailsRoot
            data-part="item"
            defaultOpen={isDefaultOpen(type, defaultValue, item.value)}
            disabled={disabled}
            key={item.value}
            {...(type === "single" ? { name: id } : {})}
            {...resolveRepeatedSlotProps(slotProps?.item, item.value)}
          >
            <DetailsSummary
              {...resolveRepeatedSlotProps(slotProps?.trigger, item.value)}
              disabled={disabled}
              part="trigger"
            >
              {item.label}
            </DetailsSummary>
            <DetailsContent
              {...resolveRepeatedSlotProps(slotProps?.panel, item.value)}
              part="panel"
            >
              {item.panel}
            </DetailsContent>
          </DetailsRoot>
        );
      })}
    </div>
  );
}
Accordion.displayName = "Accordion";
