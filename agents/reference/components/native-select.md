<!-- Generated from the package source. Do not edit by hand. -->
# native-select

- Import: `@gunkin/uiify/components/native-select`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `select`
- Without JavaScript: full
- Types file: `dist/components/native-select.d.ts`
- Note: Native text-only select; appearance:base-select is a Chrome+Safari cosmetic enhancement and Firefox keeps the OS picker.

## Related knowledge

- Recipe: [native-select](../../../skills/uiify/references/elements/native-select.md)
- Example: [select-basic](../../../skills/uiify/references/examples/select-basic.md)

## Exports

- Runtime: `NativeSelectContent`, `NativeSelectOptGroup`, `NativeSelectOption`, `NativeSelect`, `NativeSelectSeparator`
- Types: `NativeSelectContentOwnProps`, `NativeSelectOptGroupOwnProps`, `NativeSelectOptGroupProps`, `NativeSelectOptionOwnProps`, `NativeSelectOptionProps`, `NativeSelectMultiOwnProps`, `NativeSelectOwnProps`, `NativeSelectProps`, `NativeSelectSingleOwnProps`, `NativeSelectSeparatorOwnProps`, `NativeSelectSeparatorProps`

## Props and shapes

### NativeSelectSingleOwnProps

Extends: `NativeSelectShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultValue` | `string` | no |  |
| `multiple` | `false` | no |  |
| `onValueChange` | `(value: string) => void` | no | Called with the selected value. |
| `value` | `string` | no |  |

### NativeSelectMultiOwnProps

Extends: `NativeSelectShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultValue` | `readonly string[]` | no | Selects several options through the native `multiple` select. |
| `multiple` | `true` | yes |  |
| `onValueChange` | `(value: string[]) => void` | no | Called with every selected value in option order. |
| `value` | `readonly string[]` | no |  |

### NativeSelectContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### NativeSelectOptionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `disabled` | `boolean` | no |  |
| `value` | `string` | yes |  |

### NativeSelectOptGroupOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `label` | `string` | yes |  |

### NativeSelectSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `never` | no |  |

## Other types

- `NativeSelectOwnProps`: `NativeSelectSingleOwnProps | NativeSelectMultiOwnProps`
- `NativeSelectProps<TAs>`: `RenderableProps<TAs, NativeSelectOwnProps, NativeSelectOwnProps, HTMLSelectElement>`
- `NativeSelectOptionProps<TAs>`: `RenderableProps<TAs, NativeSelectOptionOwnProps, { disabled: boolean }, HTMLOptionElement>`
- `NativeSelectOptGroupProps<TAs>`: `RenderableProps<TAs, NativeSelectOptGroupOwnProps, NativeSelectOptGroupOwnProps, HTMLOptGroupElement>`
- `NativeSelectSeparatorProps<TAs>`: `RenderableProps<TAs, NativeSelectSeparatorOwnProps, Record<string, never>, HTMLHRElement>`
