<!-- Generated from the package source. Do not edit by hand. -->
# collapsible

- Import: `@gunkin/uiify/components/collapsible`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `details`
- Without JavaScript: full
- Types file: `dist/components/collapsible.d.ts`
- Related native Element (manifest): [details](../elements/details.md)
- Note: Native details/summary disclosure. Built on @gunkin/uiify/elements/details.

## Related knowledge

- Recipe: [collapsible](../../../skills/uiify/references/elements/collapsible.md)

## Exports

- Runtime: `Collapsible`
- Types: `CollapsiblePanelSlotProps`, `CollapsibleProps`, `CollapsibleSlotProps`, `CollapsibleTriggerSlotProps`

## Props and shapes

### CollapsibleSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `trigger` | `CollapsibleTriggerSlotProps` | no |  |
| `panel` | `CollapsiblePanelSlotProps` | no |  |

### CollapsibleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `ReactNode` | yes |  |
| `content` | `ReactNode` | yes |  |
| `defaultOpen` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `slotProps` | `CollapsibleSlotProps` | no |  |

## Other types

- `CollapsibleTriggerSlotProps`: `Omit<SlotProps<"summary">, "part">`
- `CollapsiblePanelSlotProps`: `Omit<SlotProps<"div">, "part">`
- `CollapsibleProps`: `CollapsibleOwnProps & Omit<ComponentPropsWithRef<"details">, keyof CollapsibleOwnProps | "children" | "dangerouslySetInnerHTML">`
