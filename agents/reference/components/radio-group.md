<!-- Generated from the package source. Do not edit by hand. -->
# radio-group

- Import: `@gunkin/uiify/components/radio-group`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio]`
- Without JavaScript: full
- Types file: `dist/components/radio-group.d.ts`
- Note: Data-driven native radio group; browser owns selection. Built on @gunkin/uiify/elements/choice.

## Exports

- Runtime: `RadioGroup`
- Types: `RadioGroupItem`, `RadioGroupProps`

## Props and shapes

### RadioGroupItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `label` | `ReactNode` | yes |  |
| `disabled` | `boolean` | no |  |
| `className` | `string` | no |  |

### RadioGroupProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly RadioGroupItem[]` | yes |  |
| `defaultValue` | `string` | no |  |
| `name` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `orientation` | `"horizontal" \| "vertical"` | no |  |
| `className` | `string` | no |  |
| `"aria-label"` | `string` | no |  |
