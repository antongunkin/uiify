<!-- Generated from the package source. Do not edit by hand. -->
# input

- Import: `@gunkin/uiify/components/input`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input`
- Without JavaScript: full
- Types file: `dist/components/input.d.ts`

## Related knowledge

- Recipe: [input](../../../skills/uiify/references/elements/input.md)

## Exports

- Runtime: `Input`
- Types: `InputOwnProps`, `InputProps`

## Props and shapes

### InputOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | no |  |
| `defaultValue` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `disabled` | `boolean` | no |  |
| `readOnly` | `boolean` | no |  |
| `invalid` | `boolean` | no |  |

## Other types

- `InputProps<TAs>`: `RenderableProps<TAs, InputOwnProps, InputOwnProps, HTMLInputElement>`
