<!-- Generated from the package source. Do not edit by hand. -->
# segmented-control

- Import: `@gunkin/uiify/components/segmented-control`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/segmented-control.d.ts`
- Related native Element (manifest): [choice](../elements/choice.md)
- Note: Built on @gunkin/uiify/elements/choice.

## Related knowledge

- Recipe: [segmented-control](../../../skills/uiify/references/elements/segmented-control.md)

## Exports

- Runtime: `SegmentedControl`
- Types: `SegmentedControlClientProps`, `SegmentedControlItem`, `SegmentedControlProps`, `SegmentedControlSlotProps`

## Props and shapes

### SegmentedControlItem

Extends: `ChoiceItem`

No own members.

### SegmentedControlProps

Extends: `ChoiceGroupRootProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly SegmentedControlItem[]` | yes |  |
| `defaultValue` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `fullWidth` | `boolean` | no |  |
| `className` | `string` | no |  |
| `slotProps` | `SegmentedControlSlotProps` | no |  |

### SegmentedControlClientProps

Extends: `SegmentedControlProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |

## Other types

- `SegmentedControlSlotProps`: `ChoiceOptionSlotProps`

## Sub-entries

### `@gunkin/uiify/components/segmented-control/client`

- Runtime: `SegmentedControlClient`
- Types: `SegmentedControlClientProps`
