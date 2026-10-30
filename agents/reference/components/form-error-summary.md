<!-- Generated from the package source. Do not edit by hand. -->
# form-error-summary

- Import: `@gunkin/uiify/components/form-error-summary`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `section + heading + ul + links`
- Without JavaScript: full
- Types file: `dist/components/form-error-summary.d.ts`
- Note: Static server-rendered error links; no alert or focus script.

## Related knowledge

- Recipe: [form-error-summary](../../../skills/uiify/references/elements/form-error-summary.md)

## Exports

- Runtime: `FormErrorSummary`
- Types: `FormErrorSummaryError`, `FormErrorSummaryOwnProps`, `FormErrorSummaryProps`, `FormErrorSummarySlotProps`

## Props and shapes

### FormErrorSummaryError

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `href` | `string` | yes |  |
| `message` | `ReactNode` | yes |  |

### FormErrorSummarySlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `SlotProps<"h2">` | no |  |
| `list` | `SlotProps<"ul">` | no |  |
| `item` | `RepeatedSlotProps<SlotProps<"li">>` | no | Repeated error props may target an error by its stable href value. |
| `link` | `RepeatedSlotProps<SlotProps<"a">>` | no |  |

### FormErrorSummaryOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | yes |  |
| `errors` | `readonly FormErrorSummaryError[]` | yes |  |
| `slotProps` | `FormErrorSummarySlotProps` | no |  |

## Other types

- `FormErrorSummaryProps<TAs>`: `RenderableProps<TAs, FormErrorSummaryOwnProps, Record<string, never>, HTMLElement>`
