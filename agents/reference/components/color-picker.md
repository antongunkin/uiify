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
- Types: `ColorPickerProps`, `ColorSpace`

## Values

- `ColorSpace`: `"limited-srgb" | "display-p3"`

## Props and shapes

### ColorPickerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `alpha` | `boolean` | no |  |
| `colorSpace` | `ColorSpace` | no |  |
| `defaultValue` | `string` | no |  |
| `label` | `string` | yes |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `value` | `string` | no |  |

## Other types

- `ColorPickerProps`: `Omit<ComponentPropsWithRef<"input">, | "alpha" | "className" | "colorSpace" | "defaultValue" | "onChange" | "ref" | "style" | "type" | "value"> & ColorPickerOwnProps & { readonly className?: string; readonly onChange?: ChangeEventHandler<HTMLInputElement>; readonly ref?: Ref<HTMLInputElement>; readonly style?: CSSProperties; }`
