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

- `ColorPickerFieldSlotProps`: `Omit<SlotProps<"div">, "id">` — The field id is the required Field.Root wiring input; use ColorPicker.id.
- `ColorPickerLabelSlotProps`: `SlotProps<"label">`
- `ColorPickerSurfaceSlotProps`: `SlotProps<"div">`
- `ColorPickerControlSlotProps`: `SlotProps<"input">`
- `ColorPickerInputSlotProps`: `SlotProps<"input"> & { readonly alpha?: string | undefined; readonly colorspace?: ColorSpace | undefined; }`
- `ColorPickerProps`: `Omit<ComponentPropsWithRef<"input">, "alpha" | "className" | "colorSpace" | "defaultValue" | "onChange" | "ref" | "style" | "value"> & ColorPickerOwnProps & { readonly className?: string; readonly onChange?: ChangeEventHandler<HTMLInputElement>; readonly ref?: Ref<HTMLInputElement>; readonly style?: CSSProperties; } & ConsumerDataAttributes`
