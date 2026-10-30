<!-- Generated from the package source. Do not edit by hand. -->
# combobox

- Import: `@gunkin/uiify/components/combobox`
- Tier 2 (Client component — pre-hydration SSR); state source S2; native element `input+listbox`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/combobox.d.ts`

## Related knowledge

- Recipe: [combobox](../../../skills/uiify/references/elements/combobox.md)

## Exports

- Runtime: `Combobox`, `ComboboxControl`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxInput`, `ComboboxItem`, `ComboboxRoot`, `ComboboxTags`, `ComboboxTrigger`
- Types: `ComboboxContentOwnProps`, `ComboboxControlOwnProps`, `ComboboxControlProps`, `ComboboxEmptyOwnProps`, `ComboboxFilterFn`, `ComboboxInputOwnProps`, `ComboboxInputProps`, `ComboboxItemData`, `ComboboxItemOwnProps`, `ComboboxRootControlledOwnProps`, `ComboboxRootShellOwnProps`, `ComboboxRootShellProps`, `ComboboxRootProps`, `ComboboxTagsOwnProps`, `ComboboxTagsSlotProps`, `ComboboxTagsProps`, `ComboboxTriggerOwnProps`, `ComboboxTriggerProps`

## Values

- `ActiveMoveDirection`: `"first" | "last" | "next" | "prev"`

## Props and shapes

### ComboboxItemData

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `label` | `string` | yes |  |
| `value` | `string` | yes |  |

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

### ComboboxContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `activeStore` | `ComboboxActiveStore` | yes |  |
| `addOnPaste` | `boolean` | yes |  |
| `anchorProps` | `UseAnchorPositionReturn["anchorProps"]` | yes |  |
| `anchorRef` | `UseAnchorPositionReturn["anchorRef"]` | yes |  |
| `close` | `() => void` | yes |  |
| `filterFn` | `ComboboxFilterFn` | yes |  |
| `inputNode` | `HTMLElement \| null` | yes |  |
| `inputValue` | `string` | yes |  |
| `items` | `readonly ComboboxItemData[]` | yes |  |
| `listboxId` | `string` | yes |  |
| `delimiters` | `readonly string[]` | yes |  |
| `multiple` | `boolean` | yes |  |
| `selectedValues` | `readonly string[]` | yes |  |
| `getValueLabel` | `(value: string) => string` | yes |  |
| `isValueSelected` | `(value: string) => boolean` | yes |  |
| `toggleValue` | `(item: ComboboxItemData) => void` | yes |  |
| `removeValue` | `(value: string) => void` | yes |  |
| `commitValue` | `(value: string) => boolean` | yes |  |
| `open` | `() => void` | yes |  |
| `openState` | `boolean` | yes |  |
| `popupProps` | `UsePopoverReturn["popupProps"]` | yes |  |
| `popupRef` | `UsePopoverReturn["popupRef"]` | yes |  |
| `positionerProps` | `UseAnchorPositionReturn["positionerProps"]` | yes |  |
| `positionerRef` | `UseAnchorPositionReturn["positionerRef"]` | yes |  |
| `selectItem` | `(item: ComboboxItemData) => void` | yes |  |
| `setInputElement` | `(element: HTMLElement \| null) => void` | yes |  |
| `setInputValue` | `(value: string) => void` | yes |  |
| `value` | `string \| readonly string[] \| undefined` | no |  |

### ComboboxRootShellOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "children">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | no |  |
| `defaultInputValue` | `string` | no |  |
| `defaultOpen` | `boolean` | no |  |
| `defaultValue` | `string` | no |  |
| `filterFn` | `ComboboxFilterFn` | no |  |
| `items` | `readonly ComboboxItemData[]` | yes |  |
| `size` | `ControlSize` | no | Sets the control's height and text size; `md` is the default. |

### ComboboxRootControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `inputValue` | `string` | no |  |
| `onInputValueChange` | `(value: string) => void` | no |  |
| `onOpenChange` | `PopoverChangeHandler` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `open` | `boolean` | no |  |
| `value` | `string \| readonly string[]` | no |  |

### ComboboxRootShellProps

Extends: `ComboboxRootShellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### ComboboxRootSingleProps

Extends: `ComboboxRootShellOwnProps`, `Omit<ComboboxRootControlledOwnProps, "onValueChange" | "value">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `multiple` | `false` | no |  |
| `defaultValue` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `value` | `string` | no |  |
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
| `item` | `ComboboxItemData` | yes |  |

### ComboboxEmptyOwnProps

Extends: `Omit<ComponentPropsWithRef<"div">, "dangerouslySetInnerHTML">`, `ConsumerDataAttributes`

No own members.

## Other types

- `ComboboxFilterFn`: `(items: readonly ComboboxItemData[], inputValue: string) => ComboboxItemData[]`
- `ComboboxRootProps`: `ComboboxRootSingleProps | ComboboxRootMultiProps`
- `ComboboxControlProps<TAs>`: `RenderableProps<TAs, ComboboxControlOwnProps, Record<string, never>, HTMLElement>`
- `ComboboxTagsProps<TAs>`: `RenderableProps<TAs, ComboboxTagsOwnProps, Record<string, never>, HTMLElement>`
- `ComboboxInputProps<TAs>`: `RenderableProps<TAs, ComboboxInputOwnProps, { open: boolean }, HTMLInputElement>`
- `ComboboxTriggerProps<TAs>`: `RenderableProps<TAs, ComboboxTriggerOwnProps, { open: boolean }, HTMLElement>`
- `ComboboxContentOwnProps`: `SlotProps<"div"> & { readonly align?: AnchorAlign; readonly children: (filteredItems: ComboboxItemData[]) => ReactNode; readonly side?: AnchorSide; }`
