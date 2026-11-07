<!-- Generated from the package source. Do not edit by hand. -->
# checkbox

- Import: `@gunkin/uiify/components/checkbox`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=checkbox] + fieldset`
- Without JavaScript: full
- Types file: `dist/components/checkbox.d.ts`
- Note: Native checkbox + label and a native fieldset CheckboxGroup. Controlled group values, select-all and the DOM mixed state live in the /client entries (CheckboxClient, CheckboxGroupClient).

## Related knowledge

- Recipe: [checkbox](../../../skills/uiify/references/elements/checkbox.md)

## Exports

- Runtime: `Checkbox`, `CheckboxGroup`
- Types: `CheckboxClientProps`, `CheckboxGroupClientProps`, `CheckboxGroupItem`, `CheckboxGroupLabels`, `CheckboxGroupProps`, `CheckboxGroupRootProps`, `CheckboxGroupSlotProps`, `CheckboxProps`, `CheckboxSlotProps`, `CheckedState`

## Props and shapes

### CheckboxOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `ReactNode` | no |  |
| `checked` | `boolean` | no | Boolean native state; use CheckboxClient from the /client entry for the mixed state. |
| `defaultChecked` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `name` | `string` | no |  |
| `value` | `string` | no |  |
| `className` | `string` | no |  |
| `onCheckedChange` | `(checked: boolean) => void` | no |  |
| `slotProps` | `CheckboxSlotProps` | no |  |
| `"aria-label"` | `string` | no |  |

### CheckboxGroupItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `label` | `ReactNode` | yes |  |
| `disabled` | `boolean` | no |  |

### CheckboxGroupSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `input` | `RepeatedSlotProps<SlotProps<"input">>` | no |  |
| `label` | `RepeatedSlotProps<SlotProps<"label">>` | no |  |
| `legend` | `SlotProps<"legend">` | no |  |
| `selectAll` | `SlotProps<"div">` | no | Props for the client group's generated select-all checkbox wrapper. |

### CheckboxGroupProps

Extends: `CheckboxGroupRootProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `ReactNode` | no | Visible legend that names the group; use aria-label/aria-labelledby instead when absent. |
| `items` | `readonly CheckboxGroupItem[]` | yes |  |
| `defaultValue` | `readonly string[]` | no |  |
| `name` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `required` | `boolean` | no | Sets data-required only; aggregate constraint validation stays with the consumer. |
| `invalid` | `boolean` | no |  |
| `orientation` | `"horizontal" \| "vertical"` | no |  |
| `className` | `string` | no |  |
| `slotProps` | `CheckboxGroupSlotProps` | no |  |

### CheckboxGroupLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `selectAll` | `string` | yes |  |

### CheckboxGroupClientProps

Extends: `CheckboxGroupProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `readonly string[]` | no |  |
| `onValueChange` | `(value: readonly string[]) => void` | no |  |
| `selectAll` | `boolean` | no |  |
| `labels` | `Partial<CheckboxGroupLabels>` | no |  |

### CheckboxGroupShellProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `items` | `readonly CheckboxGroupItem[]` | yes |  |
| `className` | `string` | no |  |
| `disabled` | `boolean` | yes |  |
| `invalid` | `boolean` | yes |  |
| `isChecked` | `(item: CheckboxGroupItem) => boolean` | yes |  |
| `isControlled` | `boolean` | yes | Client groups pass true even for internal state so every input is React-controlled. |
| `label` | `ReactNode` | no |  |
| `name` | `string` | no |  |
| `onItemChange` | `(item: CheckboxGroupItem, checked: boolean) => void` | no |  |
| `orientation` | `"horizontal" \| "vertical"` | yes |  |
| `required` | `boolean` | yes |  |
| `rootProps` | `CheckboxGroupRootProps` | yes |  |
| `selectAll` | `ReactNode` | no |  |
| `slotProps` | `CheckboxGroupSlotProps` | no |  |
| `ariaLabel` | `string` | no |  |
| `ariaLabelledBy` | `string` | no |  |

## Other types

- `CheckedState`: `NativeCheckControlCheckedState`
- `CheckboxSlotProps`: `NativeCheckControlSlotProps`
- `CheckboxProps`: `CheckboxOwnProps & Omit<ComponentPropsWithRef<"input">, keyof CheckboxOwnProps | "type" | "children" | "className" | "dangerouslySetInnerHTML">`
- `CheckboxClientProps`: `Omit<CheckboxProps, "checked"> & { readonly checked?: CheckedState; }`
- `CheckboxGroupRootProps`: `Omit<ComponentPropsWithRef<"fieldset">, "children" | "className" | "dangerouslySetInnerHTML" | "id" | "name" | "disabled">`

## Sub-entries

### `@gunkin/uiify/components/checkbox/client`

- Runtime: `CheckboxClient`, `CheckboxGroupClient`
- Types: `CheckboxClientProps`, `CheckboxGroupClientProps`, `CheckboxGroupItem`, `CheckboxGroupLabels`, `CheckboxGroupProps`, `CheckboxGroupSlotProps`, `CheckedState`
