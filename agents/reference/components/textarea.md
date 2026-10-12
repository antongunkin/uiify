<!-- Generated from the package source. Do not edit by hand. -->
# textarea

- Import: `@gunkin/uiify/components/textarea`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `textarea`
- Without JavaScript: full
- Types file: `dist/components/textarea.d.ts`
- Note: field-sizing:content replaces the auto-grow JS. Baseline since Firefox 152.

## Exports

- Runtime: `Textarea`
- Types: `TextareaOwnProps`, `TextareaProps`

## Props and shapes

### TextareaOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | no |  |
| `defaultValue` | `string` | no |  |
| `onValueChange` | `(value: string) => void` | no |  |
| `autoSize` | `boolean` | no |  |
| `disabled` | `boolean` | no |  |
| `readOnly` | `boolean` | no |  |
| `invalid` | `boolean` | no |  |

## Other types

- `TextareaProps<TAs>`: `RenderableProps<TAs, TextareaOwnProps, TextareaOwnProps, HTMLTextAreaElement>`
