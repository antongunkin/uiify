<!-- Generated from the package source. Do not edit by hand. -->
# select

- Import: `@gunkin/uiify/components/select`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `select`
- Without JavaScript: full
- Types file: `dist/components/select.d.ts`
- Note: Native text-only select; appearance:base-select is a Chrome+Safari cosmetic enhancement and Firefox keeps the OS picker.

## Related knowledge

- Recipe: [select](../../../skills/uiify/references/elements/select.md)
- Example: [select-basic](../../../skills/uiify/references/examples/select-basic.md)

## Exports

- Runtime: `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectRoot`, `SelectSeparator`
- Types: `SelectContentOwnProps`, `SelectGroupOwnProps`, `SelectGroupProps`, `SelectItemOwnProps`, `SelectItemProps`, `SelectRootMultiOwnProps`, `SelectRootOwnProps`, `SelectRootProps`, `SelectRootSingleOwnProps`, `SelectSeparatorOwnProps`, `SelectSeparatorProps`

## Props and shapes

### SelectRootSingleOwnProps

Extends: `SelectRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultValue` | `string` | no |  |
| `multiple` | `false` | no |  |
| `onValueChange` | `(value: string) => void` | no | Called with the selected value. |
| `value` | `string` | no |  |

### SelectRootMultiOwnProps

Extends: `SelectRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultValue` | `readonly string[]` | no | Selects several options through the native `multiple` select. |
| `multiple` | `true` | yes |  |
| `onValueChange` | `(value: string[]) => void` | no | Called with every selected value in option order. |
| `value` | `readonly string[]` | no |  |

### SelectContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### SelectItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `value` | `string` | yes |  |

### SelectGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `label` | `string` | yes |  |

### SelectSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `never` | no |  |

## Other types

- `SelectRootOwnProps`: `SelectRootSingleOwnProps | SelectRootMultiOwnProps`
- `SelectRootProps<TAs>`: `RenderableProps<TAs, SelectRootOwnProps, SelectRootOwnProps, HTMLSelectElement>`
- `SelectItemProps<TAs>`: `RenderableProps<TAs, SelectItemOwnProps, { disabled: boolean }, HTMLOptionElement>`
- `SelectGroupProps<TAs>`: `RenderableProps<TAs, SelectGroupOwnProps, SelectGroupOwnProps, HTMLOptGroupElement>`
- `SelectSeparatorProps<TAs>`: `RenderableProps<TAs, SelectSeparatorOwnProps, Record<string, never>, HTMLHRElement>`
