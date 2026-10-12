<!-- Generated from the package source. Do not edit by hand. -->
# button

- Import: `@gunkin/uiify/components/button`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `button`
- Without JavaScript: full
- Types file: `dist/components/button.d.ts`

## Exports

- Runtime: `Button`
- Types: `ButtonOwnProps`, `ButtonProps`, `ButtonSize`, `ButtonState`, `ButtonVariant`

## Values

- `ButtonVariant`: `"secondary" | "outline" | "ghost" | "destructive" | "link"`
- `ButtonSize`: `"sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg"`

## Props and shapes

### ButtonOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `selected` | `boolean` | no | Marks the button as the chosen one of a set, or a toggle that is on. |
| `type` | `"button" \| "submit" \| "reset"` | no |  |
| `size` | `ButtonSize` | no |  |
| `variant` | `ButtonVariant` | no |  |

### ButtonState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | yes |  |
| `selected` | `boolean` | yes |  |

## Other types

- `ButtonProps<TAs>`: `RenderableProps<TAs, ButtonOwnProps, ButtonState, HTMLElement>`
