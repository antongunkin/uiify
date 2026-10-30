<!-- Generated from the package source. Do not edit by hand. -->
# spinner

- Import: `@gunkin/uiify/components/spinner`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/spinner.d.ts`

## Related knowledge

- Recipe: [spinner](../../../skills/uiify/references/elements/spinner.md)

## Exports

- Runtime: `Spinner`
- Types: `SpinnerAlign`, `SpinnerLabels`, `SpinnerOwnProps`, `SpinnerProps`, `SpinnerSize`, `SpinnerLabelSlotProps`, `SpinnerSlotProps`

## Values

- `SpinnerAlign`: `"center" | "fixed" | "absolute"`
- `SpinnerSize`: `"sm" | "md" | "lg"`

## Props and shapes

### SpinnerLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `loading` | `string` | yes |  |

### SpinnerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `SpinnerAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `delay` | `number` | no |  |
| `label` | `string` | no |  |
| `labels` | `Partial<SpinnerLabels>` | no |  |
| `showLabel` | `boolean` | no |  |
| `size` | `SpinnerSize` | no |  |
| `value` | `number` | no |  |
| `slotProps` | `SpinnerSlotProps` | no |  |

### SpinnerSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `SpinnerLabelSlotProps` | no |  |

## Other types

- `SpinnerProps<TAs>`: `RenderableProps<TAs, SpinnerOwnProps, { visible: boolean }, HTMLElement>`
- `SpinnerLabelSlotProps`: `SlotProps<"span">`
