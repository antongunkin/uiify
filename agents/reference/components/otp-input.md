<!-- Generated from the package source. Do not edit by hand. -->
# otp-input

- Import: `@gunkin/uiify/components/otp-input`
- Tier 2 (Client component — pre-hydration SSR); state source none; native element `input`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/otp-input.d.ts`

## Related knowledge

- Recipe: [otp-input](../../../skills/uiify/references/elements/otp-input.md)

## Exports

- Runtime: `OtpInput`, `OtpInputHiddenInput`, `OtpInputRoot`, `OtpInputSlot`
- Types: `OtpInputHiddenInputProps`, `OtpInputRootControlledOwnProps`, `OtpInputRootShellOwnProps`, `OtpInputRootShellProps`, `OtpInputRootProps`, `OtpInputSlotOwnProps`, `OtpInputSlotProps`

## Values

- `OtpInputType`: `"numeric" | "alphanumeric"`

## Props and shapes

### OtpInputContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | yes |  |
| `autoFocus` | `boolean` | yes |  |
| `disabled` | `boolean` | yes |  |
| `hiddenInputRef` | `React.RefObject<HTMLInputElement \| null>` | yes |  |
| `length` | `number` | yes |  |
| `mask` | `boolean` | yes |  |
| `type` | `OtpInputType` | yes |  |
| `updateValue` | `(raw: string) => void` | yes |  |
| `value` | `string` | yes |  |
| `onHiddenBlur` | `() => void` | yes |  |
| `onHiddenFocus` | `() => void` | yes |  |

### OtpInputRootShellOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | no |  |
| `defaultValue` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `id` | `string` | no |  |
| `length` | `number` | no |  |
| `mask` | `boolean` | no |  |
| `pattern` | `string` | no |  |
| `type` | `OtpInputType` | no |  |

### OtpInputRootControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onValueChange` | `(value: string) => void` | no |  |
| `onComplete` | `(value: string) => void` | no |  |
| `value` | `string` | no |  |

### OtpInputSlotOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |

## Other types

- `OtpInputRootShellProps<TAs>`: `RenderableProps<TAs, OtpInputRootShellOwnProps, OtpInputRootShellOwnProps, HTMLElement>`
- `OtpInputRootProps<TAs>`: `RenderableProps<TAs, OtpInputRootShellOwnProps & OtpInputRootControlledOwnProps, OtpInputRootShellOwnProps & OtpInputRootControlledOwnProps, HTMLElement>`
- `OtpInputSlotProps<TAs>`: `RenderableProps<TAs, OtpInputSlotOwnProps, { active: boolean; filled: boolean }, HTMLElement>`
- `OtpInputHiddenInputProps<TAs>`: `RenderableProps<TAs, { readonly autoFocus?: boolean }, { disabled: boolean }, HTMLInputElement>`
