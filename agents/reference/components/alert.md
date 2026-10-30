<!-- Generated from the package source. Do not edit by hand. -->
# alert

- Import: `@gunkin/uiify/components/alert`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/alert.d.ts`

## Related knowledge

- Recipe: [inline-alert](../../../skills/uiify/references/elements/inline-alert.md)

## Exports

- Runtime: `Alert`, `AlertDescription`, `AlertTitle`
- Types: `AlertDescriptionOwnProps`, `AlertDescriptionProps`, `AlertOwnProps`, `AlertProps`, `AlertSlotProps`, `AlertSymbolSlotProps`, `AlertTitleOwnProps`, `AlertTitleProps`, `AlertVariant`

## Values

- `AlertVariant`: `"secondary" | "success" | "warning" | "destructive"`

## Props and shapes

### AlertOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `variant` | `AlertVariant` | no | Visual status. Defaults to secondary without adding a live role. |
| `symbol` | `string \| false` | no | Override the decorative text symbol, or hide it with false. |
| `slotProps` | `AlertSlotProps` | no |  |

### AlertTitleOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### AlertDescriptionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### AlertSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `symbol` | `AlertSymbolSlotProps` | no |  |

## Other types

- `AlertProps<TAs>`: `RenderableProps<TAs, AlertOwnProps, Record<string, never>, HTMLElement>`
- `AlertTitleProps<TAs>`: `RenderableProps<TAs, AlertTitleOwnProps, Record<string, never>, HTMLElement>`
- `AlertDescriptionProps<TAs>`: `RenderableProps<TAs, AlertDescriptionOwnProps, Record<string, never>, HTMLElement>`
- `AlertSymbolSlotProps`: `SlotProps<"span">`
