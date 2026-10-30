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
| `onPressedChange` | `(pressed: boolean) => void` | no |  |
| `disabled` | `boolean` | no |  |
| `slotProps` | `ToggleSlotProps` | no |  |

## Other types

- `ToggleControlSlotProps`: `SlotProps<"input">`
- `ToggleLabelSlotProps`: `SlotProps<"label">`
- `ToggleProps`: `ToggleOwnProps & Omit<ComponentPropsWithRef<"div">, keyof ToggleOwnProps | "children" | "dangerouslySetInnerHTML" | "id">`
