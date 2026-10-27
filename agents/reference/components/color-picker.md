<!-- Generated from the package source. Do not edit by hand. -->
# color-picker

- Import: `@gunkin/uiify/components/color-picker`
- Tier 1 (RSC shell + thin client island); state source S1; native element `input[type=color]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/color-picker.d.ts`

## Related knowledge

- Recipe: [color-picker](../../../skills/uiify/references/elements/color-picker.md)

## Exports

- Runtime: `ColorPicker`
- Types: `ColorPickerControlSlotProps`, `ColorPickerFieldSlotProps`, `ColorPickerInputSlotProps`, `ColorPickerLabelSlotProps`, `ColorPickerProps`, `ColorPickerSlotProps`, `ColorPickerSurfaceSlotProps`, `ColorSpace`

## Values

- `ColorSpace`: `"limited-srgb" | "display-p3"`

## Props and shapes

### ColorPickerSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | `ColorPickerFieldSlotProps` | no |  |
| `label` | `ColorPickerLabelSlotProps` | no |  |
| `surface` | `ColorPickerSurfaceSlotProps` | no |  |
| `control` | `ColorPickerControlSlotProps` | no |  |
| `input` | `ColorPickerInputSlotProps` | no |  |

### ColorPickerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `alpha` | `boolean` | no |  |
| `colorSpace` | `ColorSpace` | no |  |
| `defaultValue` | `string` | no |  |
| `label` | `string` | yes |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `slotProps` | `ColorPickerSlotProps` | no |  |
| `value` | `string` | no |  |

## Other types

- `ColorPickerFieldSlotProps`: `Omit<ComponentPropsWithRef<"div">, | "children" | "dangerouslySetInnerHTML" | "data-disabled" | "data-invalid" | "data-part" | "data-required" | "data-uiify-color-picker" | "data-uiify-field" | "id"> & ConsumerDataAttributes & ColorPickerFieldOwnedAttributes`
- `ColorPickerLabelSlotProps`: `Omit<ComponentPropsWithRef<"label">, | "children" | "dangerouslySetInnerHTML" | "id" | "htmlFor" | "data-disabled" | "data-part" | "data-required" | "data-uiify-color-picker"> & ConsumerDataAttributes & ColorPickerLabelOwnedAttributes`
- `ColorPickerSurfaceSlotProps`: `Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-color-picker" | "data-value"> & ConsumerDataAttributes & ColorPickerSurfaceOwnedAttributes`
- `ColorPickerControlSlotProps`: `Omit<ComponentPropsWithRef<"input">, | "children" | "dangerouslySetInnerHTML" | "aria-describedby" | "aria-hidden" | "aria-invalid" | "aria-labelledby" | "aria-required" | "disabled" | "defaultValue" | "id" | "name" | "readOnly" | "required" | "tabIndex" | "type" | "value" | "data-disabled" | "data-invalid" | "data-part" | "data-required" | "data-uiify-color-picker" | "data-uiify-input"> & ConsumerDataAttributes & ColorPickerControlOwnedAttributes`
- `ColorPickerInputSlotProps`: `Omit<ComponentPropsWithRef<"input">, | "children" | "dangerouslySetInnerHTML" | "aria-invalid" | "aria-label" | "aria-labelledby" | "disabled" | "id" | "type" | "value" | "alpha" | "colorspace" | "defaultValue" | "data-part" | "data-uiify-color-picker" | "required"> & ConsumerDataAttributes & ColorPickerPartOwnedAttributes`
- `ColorPickerProps`: `Omit<ComponentPropsWithRef<"input">, | "alpha" | "className" | "colorSpace" | "defaultValue" | "onChange" | "ref" | "style" | "type" | "value"> & ColorPickerOwnProps & { readonly className?: string; readonly onChange?: ChangeEventHandler<HTMLInputElement>; readonly ref?: Ref<HTMLInputElement>; readonly style?: CSSProperties; } & { readonly "data-uiify-color-picker"?: never; readonly "data-uiify-field"?: never; }`
