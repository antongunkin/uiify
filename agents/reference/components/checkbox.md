<!-- Generated from the package source. Do not edit by hand. -->
# checkbox

- Import: `@gunkin/uiify/components/checkbox`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=checkbox]`
- Without JavaScript: full
- Types file: `dist/components/checkbox.d.ts`
- Note: Native checkbox + label; default entry ships controlled callbacks with use client.

## Exports

- Runtime: `Checkbox`
- Types: `CheckboxProps`, `CheckedState`

## Props and shapes

### CheckboxProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `ReactNode` | no |  |
| `checked` | `CheckedState` | no |  |
| `defaultChecked` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `className` | `string` | no |  |
| `onCheckedChange` | `(checked: boolean) => void` | no |  |
| `"aria-label"` | `string` | no |  |

## Other types

- `CheckedState`: `boolean | "indeterminate"`
