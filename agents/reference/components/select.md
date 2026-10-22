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
- Types: `SelectContentOwnProps`, `SelectGroupOwnProps`, `SelectGroupProps`, `SelectItemOwnProps`, `SelectItemProps`, `SelectRootOwnProps`, `SelectRootProps`, `SelectSeparatorOwnProps`, `SelectSeparatorProps`

## Props and shapes

### SelectRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `value` | `string` | no |  |
| `defaultValue` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `name` | `string` | no |  |
| `disabled` | `boolean` | no |  |

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

- `SelectRootProps<TAs>`: `RenderableProps<TAs, SelectRootOwnProps, SelectRootOwnProps, HTMLSelectElement>`
- `SelectItemProps<TAs>`: `RenderableProps<TAs, SelectItemOwnProps, { disabled: boolean }, HTMLOptionElement>`
- `SelectGroupProps<TAs>`: `RenderableProps<TAs, SelectGroupOwnProps, SelectGroupOwnProps, HTMLOptGroupElement>`
- `SelectSeparatorProps<TAs>`: `RenderableProps<TAs, SelectSeparatorOwnProps, Record<string, never>, HTMLHRElement>`
