<!-- Generated from the package source. Do not edit by hand. -->
# combobox

- Import: `@gunkin/uiify/components/combobox`
- Tier 2 (Client component — pre-hydration SSR); state source S2; native element `input+listbox`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/combobox.d.ts`

## Related knowledge

- Recipe: [combobox](../../../skills/uiify/references/elements/combobox.md)

## Exports

- Runtime: `Combobox`, `ComboboxControl`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxFormControl`, `ComboboxGroup`, `ComboboxGroupLabel`, `ComboboxInput`, `ComboboxItem`, `ComboboxRoot`, `ComboboxStatus`, `ComboboxTags`, `ComboboxTrigger`, `createComboboxItems`
- Types: `ComboboxContentOwnProps`, `ComboboxControlOwnProps`, `ComboboxControlProps`, `ComboboxEmptyOwnProps`, `ComboboxFilterFn`, `ComboboxFormControlProps`, `ComboboxGroupOwnProps`, `ComboboxGroupLabelOwnProps`, `ComboboxInputOwnProps`, `ComboboxInputProps`, `ComboboxItemData`, `ComboboxStatusProps`, `ComboboxItemAdapterOptions`, `ComboboxItemCollection`, `ComboboxItemOwnProps`, `ComboboxRootControlledOwnProps`, `ComboboxRootShellOwnProps`, `ComboboxRootShellProps`, `ComboboxRootProps`, `ComboboxSingleValueOptions`, `ComboboxTagsOwnProps`, `ComboboxTagsSlotProps`, `ComboboxTagsProps`, `ComboboxTriggerOwnProps`, `ComboboxTriggerProps`

## Values

- `ActiveMoveDirection`: `"first" | "last" | "next" | "prev"`

## Props and shapes

### ComboboxItemData

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `label` | `string` | yes |  |
| `value` | `string` | yes |  |

### ComboboxItemAdapterOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getValue` | `(record: T) => string` | yes |  |
| `getLabel` | `(record: T) => string` | yes |  |
| `isDisabled` | `(record: T) => boolean` | no |  |

### ComboboxItemCollection

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `readonly ComboboxItemData[]` | yes |  |
| `getItem` | `(value: string) => T \| undefined` | yes |  |

### ComboboxActiveStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getActiveId` | `() => string \| null` | yes |  |
| `isActive` | `(id: string) => boolean` | yes |  |
| `setActiveId` | `(next: string \| null) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `subscribeItem` | `(id: string, listener: () => void) => () => void` | yes |  |

### ComboboxMultiValueOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `addOnPaste` | `boolean` | no |  |
| `allowCustomValue` | `boolean` | no |  |
| `delimiters` | `readonly string[]` | no |  |
| `maxValues` | `number` | no |  |
| `validateValue` | `(value: string) => boolean` | no |  |

### ComboboxSingleValueOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `allowCustomValue` | `boolean` | no | Allows a nonempty unmatched value to commit on Enter. |
| `validateValue` | `(value: string) => boolean` | no | Rejects a custom value when it returns false. |

### ComboboxFormState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `required` | `boolean` | yes |  |
| `invalid` | `boolean` | yes |  |

### ComboboxFormControlProps

Native submission bridge; selection and option content are owned by Root.

Extends: `Omit<ComponentPropsWithRef<"select">, "children" | "multiple" | "value" | "defaultValue" | "onChange">`, `ConsumerDataAttributes`

No own members.

### ComboboxContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `reset` | `() => void` | yes |  |
| `formState` | `ComboboxFormState` | yes |  |
| `hasControl` | `boolean` | yes |  |
| `setHasControl` | `(value: boolean) => void` | yes |  |
| `registerFormControl` | `(node: HTMLSelectElement) => () => void` | yes |  |
| `setFormState` | `(state: ComboboxFormState) => void` | yes |  |
| `activeStore` | `ComboboxActiveStore` | yes |  |
| `addOnPaste` | `boolean` | yes |  |
| `allowCustomValue` | `boolean` | yes |  |
| `anchorProps` | `UseAnchorPositionReturn["anchorProps"]` | yes |  |
| `anchorRef` | `UseAnchorPositionReturn["anchorRef"]` | yes |  |
| `close` | `() => void` | yes |  |
| `filterFn` | `ComboboxFilterFn` | yes |  |
| `filterQuery` | `string` | yes |  |
| `inputNode` | `HTMLElement \| null` | yes |  |
| `inputValue` | `string` | yes |  |
| `loading` | `boolean` | yes |  |
| `items` | `readonly ComboboxItemData[]` | yes |  |
| `listboxId` | `string` | yes |  |
| `delimiters` | `readonly string[]` | yes |  |
| `disabled` | `boolean` | yes |  |
| `isDisabled` | `() => boolean` | yes |  |
| `multiple` | `boolean` | yes |  |
| `selectedValues` | `readonly string[]` | yes |  |
| `getValueLabel` | `(value: string) => string` | yes |  |
| `isValueSelected` | `(value: string) => boolean` | yes |  |
| `toggleValue` | `(item: ComboboxItemData) => void` | yes |  |
| `removeValue` | `(value: string) => void` | yes |  |
| `commitValue` | `(value: string) => boolean` | yes |  |
| `commitSingleValue` | `(value: string) => boolean` | yes |  |
| `open` | `() => void` | yes |  |
| `openState` | `boolean` | yes |  |
| `popupProps` | `UsePopoverReturn["popupProps"]` | yes |  |
| `popupRef` | `UsePopoverReturn["popupRef"]` | yes |  |
| `positionerProps` | `UseAnchorPositionReturn["positionerProps"]` | yes |  |
| `positionerRef` | `UseAnchorPositionReturn["positionerRef"]` | yes |  |
| `selectItem` | `(item: ComboboxItemData) => void` | yes |  |
| `setInputElement` | `(element: HTMLElement \| null) => void` | yes |  |
| `setInputValue` | `(value: string) => void` | yes |  |
| `value` | `string \| null \| readonly string[] \| undefined` | no |  |

### ComboboxRootShellOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "children" | "defaultValue">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `defaultInputValue` | `string` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `defaultValue` | `string \| null` | no | In single mode, `null` means no selection; an empty string is a valid item ID. |
| `disabled` | `boolean` | no | Blocks model mutations and supplies the default disabled state to native controls. |
| `filterFn` | `ComboboxFilterFn` | no |  |
| `items` | `readonly ComboboxItemData[]` | yes |  |
| `loading` | `boolean` | no | Marks consumer-managed results as loading while keeping existing options available. |
| `size` | `ControlSize` | no | Sets the control's height and text size; `md` is the default. |

### ComboboxRootControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `inputValue` | `string` | no |  |
| `onInputValueChange` | `(value: string) => void` | no |  |
| `onOpenChange` | `PopoverChangeHandler` | no |  |
| `onValueChange` | `(value: string \| null) => void` | no |  |
| `open` | `boolean` | no |  |
| `value` | `string \| null \| readonly string[]` | no |  |

### ComboboxRootShellProps

Extends: `ComboboxRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ComboboxRootSingleProps

Extends: `ComboboxRootShellOwnProps`, `ComboboxSingleValueOptions`, `Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `multiple` | `false` | no |  |
| `defaultValue` | `string \| null` | no |  |
| `onValueChange` | `(value: string \| null) => void` | no |  |
| `value` | `string \| null` | no |  |
| `children` | `ReactNode` | no |  |

### ComboboxRootMultiProps

Extends: `Omit<ComboboxRootShellOwnProps, "defaultValue">`, `Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value">`, `ComboboxMultiValueOptions`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `multiple` | `true` | yes |  |
| `defaultValue` | `readonly string[]` | no |  |
| `onValueChange` | `(value: string[]) => void` | no |  |
| `value` | `readonly string[]` | no |  |
| `children` | `ReactNode` | no |  |

### ComboboxControlOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ComboboxTagsOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |
| `slotProps` | `ComboboxTagsSlotProps` | no |  |

### ComboboxTagsSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `tag` | `RepeatedSlotProps<SlotProps<"span">>` | no |  |
| `remove` | `RepeatedSlotProps<SlotProps<"button">>` | no |  |

### ComboboxInputOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |

### ComboboxTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `className` | `string` | no |  |

### ComboboxItemOwnProps

Extends: `SlotProps<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Option content; when omitted, the item's string label is rendered. |
| `item` | `ComboboxItemData` | yes |  |

### ComboboxGroupOwnProps

Extends: `SlotProps<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Options in this named group. Link it to `GroupLabel` with `aria-labelledby`. |

### ComboboxGroupLabelOwnProps

Extends: `SlotProps<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no | Visible heading referenced by the group's `aria-labelledby`. |

### ComboboxEmptyOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "dangerouslySetInnerHTML">`, `ConsumerDataAttributes`

No own members.

### ComboboxStatusProps

Extends: `SlotProps<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

## Other types

- `ComboboxFilterFn`: `(items: readonly ComboboxItemData[], inputValue: string) => ComboboxItemData[]`
- `ComboboxRootProps`: `ComboboxRootSingleProps | ComboboxRootMultiProps`
- `ComboboxControlProps<TAs>`: `RenderableProps<TAs, ComboboxControlOwnProps, Record<string, never>, HTMLElement>`
- `ComboboxTagsProps<TAs>`: `RenderableProps<TAs, ComboboxTagsOwnProps, Record<string, never>, HTMLElement>`
- `ComboboxInputProps<TAs>`: `RenderableProps<TAs, ComboboxInputOwnProps, { open: boolean }, HTMLInputElement>`
- `ComboboxTriggerProps<TAs>`: `RenderableProps<TAs, ComboboxTriggerOwnProps, { open: boolean }, HTMLElement>`
- `ComboboxContentOwnProps`: `SlotProps<"div"> & { readonly align?: AnchorAlign; readonly children: (filteredItems: ComboboxItemData[]) => ReactNode; readonly side?: AnchorSide; }`
