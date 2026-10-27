<!-- Generated from the package source. Do not edit by hand. -->
# accordion

- Import: `@gunkin/uiify/components/accordion`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `details[name]`
- Without JavaScript: full
- Types file: `dist/components/accordion.d.ts`
- Related native Element (manifest): [details](../elements/details.md)
- Note: Native details/summary disclosure; name groups single-open items. Built on @gunkin/uiify/elements/details.

## Related knowledge

- Recipe: [accordion](../../../skills/uiify/references/elements/accordion.md)

## Exports

- Runtime: `Accordion`
- Types: `AccordionItem`, `AccordionItemSlotProps`, `AccordionPanelSlotProps`, `AccordionProps`, `AccordionSlotProps`, `AccordionTriggerSlotProps`, `AccordionType`

## Values

- `AccordionType`: `"single" | "multiple"`

## Props and shapes

### AccordionItem

Extends: `ChoicePanelItem`

No own members.

### AccordionSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | `AccordionItemSlotProps` | no |  |
| `trigger` | `AccordionTriggerSlotProps` | no |  |
| `panel` | `AccordionPanelSlotProps` | no |  |

### AccordionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly AccordionItem[]` | yes |  |
| `type` | `AccordionType` | no |  |
| `defaultValue` | `string \| readonly string[]` | no |  |
| `slotProps` | `AccordionSlotProps` | no |  |

## Other types

- `AccordionItemSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"details">, | "name" | "open" | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-details" | "data-uiify-accordion" | "disabled">, AccordionOwnedSlotAttributes>`
- `AccordionTriggerSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"summary">, | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-details" | "data-uiify-accordion" | "disabled" | "part">, AccordionOwnedSlotAttributes>`
- `AccordionPanelSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"div">, | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-details" | "data-uiify-accordion" | "part">, AccordionOwnedSlotAttributes>`
- `AccordionProps`: `AccordionOwnProps & Omit<ComponentPropsWithRef<"div">, keyof AccordionOwnProps | "children" | "dangerouslySetInnerHTML" | "data-uiify-accordion">`
