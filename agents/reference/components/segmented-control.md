<!-- Generated from the package source. Do not edit by hand. -->
# segmented-control

- Import: `@gunkin/uiify/components/segmented-control`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/segmented-control.d.ts`
- Note: Built on @gunkin/uiify/elements/choice.

## Exports

- Runtime: `SegmentedControl`
- Types: `SegmentedControlClientProps`, `SegmentedControlItem`, `SegmentedControlProps`

## Props and shapes

### SegmentedControlItem

Extends: `ChoiceItem`

No own members.

### SegmentedControlProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly SegmentedControlItem[]` | yes |  |
| `defaultValue` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `fullWidth` | `boolean` | no |  |
| `className` | `string` | no |  |
| `"aria-label"` | `string` | no |  |
| `"aria-labelledby"` | `string` | no |  |

### SegmentedControlClientProps

Extends: `SegmentedControlProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |

## Sub-entries

### `@gunkin/uiify/components/segmented-control/client`

- Runtime: `SegmentedControlClient`
- Types: `SegmentedControlClientProps`
