<!-- Generated from the package source. Do not edit by hand. -->
# slider

- Import: `@gunkin/uiify/components/slider`
- Tier 0 (RSC — zero client JavaScript); state source S1; native element `input[type=range]`
- Without JavaScript: full
- Types file: `dist/components/slider.d.ts`

## Exports

- Runtime: `Slider`
- Types: `SliderLabels`, `SliderOwnProps`, `SliderProps`

## Props and shapes

### SliderMark

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `number` | yes |  |
| `label` | `ReactNode` | no |  |

### SliderOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `number` | no |  |
| `defaultValue` | `number` | no |  |
| `onValueChange` | `(value: number) => void` | no |  |
| `min` | `number` | no |  |
| `max` | `number` | no |  |
| `step` | `number` | no |  |
| `disabled` | `boolean` | no |  |

### SliderClientOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `SliderClientValue` | no |  |
| `defaultValue` | `SliderClientValue` | no |  |
| `onValueChange` | `(value: SliderClientValue) => void` | no |  |
| `min` | `number` | no |  |
| `max` | `number` | no |  |
| `step` | `number \| null` | no |  |
| `disabled` | `boolean` | no |  |
| `orientation` | `"horizontal" \| "vertical"` | no |  |
| `marks` | `readonly SliderMark[]` | no |  |
| `labels` | `Partial<SliderLabels>` | no |  |
| `thumbLabels` | `readonly [string, string]` | no |  |
| `"aria-label"` | `string` | no |  |
| `"aria-labelledby"` | `string` | no |  |

### SliderLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `minimum` | `string` | yes |  |
| `maximum` | `string` | yes |  |

### SliderClientRenderState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | yes |  |
| `orientation` | `"horizontal" \| "vertical"` | yes |  |
| `value` | `SliderClientValue` | yes |  |

## Other types

- `SliderClientValue`: `number | readonly [number, number]`
- `SliderClientProps<TAs>`: `RenderableProps<TAs, SliderClientOwnProps, SliderClientRenderState, HTMLDivElement>`
- `SliderProps<TAs>`: `RenderableProps<TAs, SliderOwnProps, SliderOwnProps, HTMLInputElement>`

## Sub-entries

### `@gunkin/uiify/components/slider/client`

- Runtime: `SliderClient`
- Types: `SliderClientOwnProps`, `SliderClientProps`, `SliderClientRenderState`, `SliderClientValue`, `SliderMark`
