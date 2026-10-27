<!-- Generated from the package source. Do not edit by hand. -->
# tabs

- Import: `@gunkin/uiify/components/tabs`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/tabs.d.ts`
- Related native Element (manifest): [choice](../elements/choice.md)
- Note: Data-driven native radio switcher; CSS-only panels. Built on @gunkin/uiify/elements/choice.

## Related knowledge

- Recipe: [tabs](../../../skills/uiify/references/elements/tabs.md)

## Exports

- Runtime: `Tabs`
- Types: `TabsInputSlotProps`, `TabsItem`, `TabsItemSlotProps`, `TabsPanelSlotProps`, `TabsProps`, `TabsSlotProps`, `TabsTriggerSlotProps`

## Props and shapes

### TabsStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getValue` | `() => string \| undefined` | yes |  |
| `isSelected` | `(itemValue: string) => boolean` | yes |  |
| `setValue` | `(next: string \| undefined) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `subscribeItem` | `(itemValue: string, listener: () => void) => () => void` | yes |  |

### TabsItem

Extends: `ChoicePanelItem`

No own members.

### TabsSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | `TabsItemSlotProps` | no |  |
| `input` | `TabsInputSlotProps` | no |  |
| `trigger` | `TabsTriggerSlotProps` | no |  |
| `panel` | `TabsPanelSlotProps` | no |  |
| `append` | `Omit<ComponentPropsWithRef<"div">, "children" \| "dangerouslySetInnerHTML" \| "data-part" \| "data-uiify-tabs"> & ConsumerDataAttributes & TabsPartOwnedAttributes` | no |  |

### TabsOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly TabsItem[]` | yes |  |
| `defaultValue` | `string` | no |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `append` | `ReactNode` | no | Optional control rendered at the end of the tab bar. |
| `slotProps` | `TabsSlotProps` | no |  |

## Other types

- `TabsItemSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-choice" | "data-uiify-tabs">, TabsItemOwnedAttributes>`
- `TabsInputSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"input">, | "aria-labelledby" | "checked" | "defaultChecked" | "disabled" | "id" | "name" | "type" | "value" | "data-part" | "data-uiify-choice" | "data-uiify-radio" | "data-uiify-tabs">, TabsControlOwnedAttributes>`
- `TabsTriggerSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"label">, "children" | "dangerouslySetInnerHTML" | "htmlFor" | "id" | "data-part" | "data-uiify-tabs">, TabsPartOwnedAttributes>`
- `TabsPanelSlotProps`: `RepeatedSlotProps<Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML" | "id" | "data-part" | "data-uiify-tabs">, TabsPartOwnedAttributes>`
- `TabsProps`: `TabsOwnProps & Omit<ComponentPropsWithRef<"div">, | keyof TabsOwnProps | "children" | "dangerouslySetInnerHTML" | "data-uiify-choice" | "data-uiify-tabs">`
