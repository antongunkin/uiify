<!-- Generated from the package source. Do not edit by hand. -->
# toggle

- Import: `@gunkin/uiify/components/toggle`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=checkbox]`
- Without JavaScript: full
- Types file: `dist/components/toggle.d.ts`
- Note: Native checkbox + label toggle; browser owns pressed state.

## Related knowledge

- Recipe: [toggle](../../../skills/uiify/references/elements/toggle.md)

## Exports

- Runtime: `Toggle`
- Types: `ToggleControlSlotProps`, `ToggleLabelSlotProps`, `ToggleProps`, `ToggleSlotProps`

## Props and shapes

### ToggleSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `control` | `ToggleControlSlotProps` | no |  |
| `label` | `ToggleLabelSlotProps` | no |  |

### ToggleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `ReactNode` | yes |  |
| `pressed` | `boolean` | no |  |
| `defaultPressed` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `slotProps` | `ToggleSlotProps` | no |  |

## Other types

- `ToggleControlSlotProps`: `Omit<ComponentPropsWithRef<"input">, | "aria-labelledby" | "checked" | "data-disabled" | "data-part" | "data-state" | "data-uiify-toggle" | "defaultChecked" | "disabled" | "id" | "type"> & ToggleControlOwnedAttributes & ConsumerDataAttributes`
- `ToggleLabelSlotProps`: `Omit<ComponentPropsWithRef<"label">, "children" | "data-part" | "data-uiify-button" | "data-variant" | "htmlFor" | "id"> & ToggleLabelOwnedAttributes & ConsumerDataAttributes`
- `ToggleProps`: `ToggleOwnProps & Omit<ComponentPropsWithRef<"div">, | keyof ToggleOwnProps | "children" | "dangerouslySetInnerHTML" | "data-disabled" | "data-uiify-toggle" | "id">`
