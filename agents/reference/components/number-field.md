<!-- Generated from the package source. Do not edit by hand. -->
# number-field

- Import: `@gunkin/uiify/components/number-field`
- Tier 1 (RSC shell + thin client island); state source S1; native element `input[type=text][role=spinbutton]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/number-field.d.ts`

## Related knowledge

- Recipe: [number-field](../../../skills/uiify/references/elements/number-field.md)

## Exports

- Runtime: `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldRoot`
- Types: `NumberFieldDecrementProps`, `NumberFieldGroupProps`, `NumberFieldIncrementProps`, `NumberFieldInputOwnProps`, `NumberFieldInputProps`, `NumberFieldRootOwnProps`, `NumberFieldRootProps`

## Props and shapes

### NumberFieldContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `clampValueOnBlur` | `boolean` | yes |  |
| `commitInput` | `(raw: string) => void` | yes |  |
| `decrement` | `(multiplier?: number) => void` | yes |  |
| `disabled` | `boolean` | yes |  |
| `displayValue` | `string` | yes |  |
| `formatter` | `Intl.NumberFormat` | yes |  |
| `increment` | `(multiplier?: number) => void` | yes |  |
| `inputId` | `string` | yes |  |
| `inputRef` | `RefObject<HTMLInputElement \| null>` | yes |  |
| `max` | `number \| undefined` | no |  |
| `min` | `number \| undefined` | no |  |
| `numericValue` | `number \| undefined` | yes |  |
| `readOnly` | `boolean` | yes |  |
| `required` | `boolean` | yes |  |
| `setDisplayValue` | `(next: string) => void` | yes |  |
| `setEditing` | `(next: boolean) => void` | yes |  |

### NumberFieldRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `allowWheel` | `boolean` | no |  |
| `clampValueOnBlur` | `boolean` | no |  |
| `defaultValue` | `number` | no |  |
| `disabled` | `boolean` | no |  |
| `formatOptions` | `Intl.NumberFormatOptions` | no |  |
| `locale` | `string` | no | BCP 47 locale used to format and parse the value. Defaults to `"en-US"`. |
| `max` | `number` | no |  |
| `min` | `number` | no |  |
| `onValueChange` | `(value: number \| undefined) => void` | no |  |
| `readOnly` | `boolean` | no |  |
| `required` | `boolean` | no |  |
| `step` | `number` | no |  |
| `value` | `number` | no |  |

### NumberFieldInputOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | no |  |
| `onBlur` | `FocusEventHandler<HTMLInputElement>` | no |  |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | no |  |
| `onFocus` | `FocusEventHandler<HTMLInputElement>` | no |  |
| `onKeyDown` | `KeyboardEventHandler<HTMLInputElement>` | no |  |

## Other types

- `NumberFieldRootProps<TAs>`: `RenderableProps<TAs, NumberFieldRootOwnProps, NumberFieldRootOwnProps, HTMLElement>`
- `NumberFieldGroupProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLElement>`
- `NumberFieldInputProps<TAs>`: `RenderableProps<TAs, NumberFieldInputOwnProps, { disabled: boolean; readOnly: boolean; required: boolean }, HTMLInputElement>`
- `NumberFieldIncrementProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLButtonElement>`
- `NumberFieldDecrementProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLButtonElement>`
