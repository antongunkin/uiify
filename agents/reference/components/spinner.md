<!-- Generated from the package source. Do not edit by hand. -->
# spinner

- Import: `@gunkin/uiify/components/spinner`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `div`
- Without JavaScript: full
- Types file: `dist/components/spinner.d.ts`

## Exports

- Runtime: `Spinner`
- Types: `SpinnerAlign`, `SpinnerLabels`, `SpinnerOwnProps`, `SpinnerProps`, `SpinnerSize`

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

## Other types

- `SpinnerProps<TAs>`: `RenderableProps<TAs, SpinnerOwnProps, { visible: boolean }, HTMLElement>`
