<!-- Generated from the package source. Do not edit by hand. -->
# toggle-group

- Import: `@gunkin/uiify/components/toggle-group`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=radio|checkbox]`
- Without JavaScript: full
- Types file: `dist/components/toggle-group.d.ts`
- Note: Built on @gunkin/uiify/elements/choice.

## Exports

- Runtime: `ToggleGroup`
- Types: `ToggleGroupClientProps`, `ToggleGroupItem`, `ToggleGroupProps`

## Props and shapes

### ToggleGroupProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `type` | `"single" \| "multiple"` | no |  |
| `items` | `readonly ToggleGroupItem[]` | yes |  |
| `defaultValue` | `string \| readonly string[]` | no |  |
| `disabled` | `boolean` | no |  |
| `orientation` | `ChoiceOrientation` | no |  |
| `size` | `"sm" \| "md" \| "lg"` | no | Button size of each item; `md` metrics when omitted. |
| `className` | `string` | no |  |
| `"aria-label"` | `string` | no |  |
| `"aria-labelledby"` | `string` | no |  |

### ToggleGroupClientProps

Extends: `ToggleGroupProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string \| readonly string[]` | no |  |
| `onValueChange` | `(value: string \| readonly string[]) => void` | no |  |

## Other types

- `ToggleGroupItem`: `ChoiceItem`

## Sub-entries

### `@gunkin/uiify/components/toggle-group/client`

- Runtime: `ToggleGroupClient`
- Types: `ToggleGroupClientProps`
