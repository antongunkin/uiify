<!-- Generated from the package source. Do not edit by hand. -->
# number-field

- Import: `@gunkin/uiify/components/number-field`
- Tier 1 (RSC shell + thin client island); state source S1; native element `input[type=number]`
- Without JavaScript: degraded-documented
- Types file: `dist/components/number-field.d.ts`

## Exports

- Runtime: `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldRoot`
- Types: `NumberFieldDecrementProps`, `NumberFieldGroupProps`, `NumberFieldIncrementProps`, `NumberFieldInputProps`, `NumberFieldRootOwnProps`, `NumberFieldRootProps`

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
| `max` | `number` | no |  |
| `min` | `number` | no |  |
| `onValueChange` | `(value: number \| undefined) => void` | no |  |
| `readOnly` | `boolean` | no |  |
| `required` | `boolean` | no |  |
| `step` | `number` | no |  |
| `value` | `number` | no |  |

## Other types

- `NumberFieldRootProps<TAs>`: `RenderableProps<TAs, NumberFieldRootOwnProps, NumberFieldRootOwnProps, HTMLElement>`
- `NumberFieldGroupProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLElement>`
- `NumberFieldInputProps<TAs>`: `RenderableProps<TAs, Record<string, never>, { disabled: boolean; readOnly: boolean; required: boolean }, HTMLInputElement>`
- `NumberFieldIncrementProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLButtonElement>`
- `NumberFieldDecrementProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, { disabled: boolean }, HTMLButtonElement>`
