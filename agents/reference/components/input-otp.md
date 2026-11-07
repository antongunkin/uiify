<!-- Generated from the package source. Do not edit by hand. -->
# input-otp

- Import: `@gunkin/uiify/components/input-otp`
- Tier 2 (Client component — pre-hydration SSR); state source none; native element `input`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/input-otp.d.ts`

## Related knowledge

- Recipe: [input-otp](../../../skills/uiify/references/elements/input-otp.md)

## Exports

- Runtime: `InputOTPHiddenInput`, `InputOTP`, `InputOTPSlot`
- Types: `InputOTPHiddenInputProps`, `InputOTPControlledOwnProps`, `InputOTPShellOwnProps`, `InputOTPShellProps`, `InputOTPProps`, `InputOTPSlotOwnProps`, `InputOTPSlotProps`

## Values

- `InputOTPType`: `"numeric" | "alphanumeric"`

## Props and shapes

### InputOTPContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | yes |  |
| `autoFocus` | `boolean` | yes |  |
| `disabled` | `boolean` | yes |  |
| `hiddenInputRef` | `React.RefObject<HTMLInputElement \| null>` | yes |  |
| `length` | `number` | yes |  |
| `mask` | `boolean` | yes |  |
| `type` | `InputOTPType` | yes |  |
| `updateValue` | `(raw: string) => void` | yes |  |
| `value` | `string` | yes |  |
| `onHiddenBlur` | `() => void` | yes |  |
| `onHiddenFocus` | `() => void` | yes |  |

### InputOTPShellOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | no |  |
| `defaultValue` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `id` | `string` | no |  |
| `length` | `number` | no |  |
| `mask` | `boolean` | no |  |
| `pattern` | `string` | no |  |
| `size` | `ControlSize` | no | Sets the control's height and text size; `md` is the default. |
| `type` | `InputOTPType` | no |  |

### InputOTPControlledOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `onValueChange` | `(value: string) => void` | no |  |
| `onComplete` | `(value: string) => void` | no |  |
| `value` | `string` | no |  |

### InputOTPSlotOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |

## Other types

- `InputOTPShellProps<TAs>`: `RenderableProps<TAs, InputOTPShellOwnProps, InputOTPShellOwnProps, HTMLElement>`
- `InputOTPProps<TAs>`: `RenderableProps<TAs, InputOTPShellOwnProps & InputOTPControlledOwnProps, InputOTPShellOwnProps & InputOTPControlledOwnProps, HTMLElement>`
- `InputOTPSlotProps<TAs>`: `RenderableProps<TAs, InputOTPSlotOwnProps, { active: boolean; filled: boolean }, HTMLElement>`
- `InputOTPHiddenInputProps<TAs>`: `RenderableProps<TAs, { readonly autoFocus?: boolean | undefined }, { disabled: boolean }, HTMLInputElement>`
