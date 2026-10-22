<!-- Generated from the package source. Do not edit by hand. -->
# candle-chart

- Import: `@gunkin/uiify/components/candle-chart`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `figure>ol>li`
- Without JavaScript: full
- Types file: `dist/components/candle-chart.d.ts`
- Note: Static OHLC geometry is computed during render and expressed as percentage CSS custom properties; the decorative candle glyphs have an accessible table fallback.

## Related knowledge

- Recipe: [candle-chart](../../../skills/uiify/references/elements/candle-chart.md)

## Exports

- Runtime: `CandleChart`
- Types: `CandleChartAxisLabel`, `CandleChartLabels`, `CandleChartData`, `CandleChartOwnProps`, `CandleChartPointerPosition`, `CandleChartProps`

## Props and shapes

### CandleChartData

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `time` | `string \| number` | yes |  |
| `open` | `number` | yes |  |
| `high` | `number` | yes |  |
| `low` | `number` | yes |  |
| `close` | `number` | yes |  |

### CandleChartAxisLabel

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes |  |
| `position` | `number` | yes | Position on the axis as a percentage from 0 to 100. |

### CandleChartPointerPosition

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |
| `offsetY` | `number` | yes | Pointer offset inside the candle hit area, in CSS pixels. |

### CandleChartOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"aria-label"` | `string` | no |  |
| `labels` | `Partial<CandleChartLabels>` | no |  |
| `activeCandleIndex` | `number` | no |  |
| `cursorY` | `number` | no |  |
| `data` | `readonly CandleChartData[]` | yes |  |
| `interactive` | `boolean` | no |  |
| `locale` | `string` | no | BCP 47 locale for default axis labels. Defaults to `"en-US"`. |
| `onCandleClick` | `(index: number) => void` | no |  |
| `onCandlePointerLeave` | `() => void` | no |  |
| `onCandlePointerMove` | `(position: CandleChartPointerPosition) => void` | no |  |
| `selectedCandleIndex` | `number` | no |  |
| `xAxis` | `readonly CandleChartAxisLabel[]` | no |  |
| `yAxis` | `readonly CandleChartAxisLabel[]` | no |  |

### CandleChartLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `chart` | `string` | yes |  |
| `candle` | `string` | yes |  |
| `candles` | `string` | yes |  |
| `months` | `string` | yes |  |
| `prices` | `string` | yes |  |
| `data` | `string` | yes |  |
| `time` | `string` | yes |  |
| `open` | `string` | yes |  |
| `high` | `string` | yes |  |
| `low` | `string` | yes |  |
| `close` | `string` | yes |  |

### CandleChartClientOwnProps

Extends: `CandleChartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `visibleCount` | `number` | no | Live mode: sizes candles so `visibleCount` fill the viewport and virtualizes the full history with a horizontal VirtualScroll. The chart follows new candles while the reader is at the newest one; the price scale, axes, readout, and data table follow the visible candles. Zoom is disabled. |

### CandleChartViewProps

Internal props the client entry passes to `CandleChart`; not part of the public API.

Extends: `CandleChartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `candleLayer` | `ReactNode` | no | Replaces the static candle list (e.g. with a virtualized layer). |
| `announceReadout` | `boolean` | no | Announce readout changes; off for streaming data. Defaults to `true`. |
| `slotCount` | `number` | no | Slots the crosshair is positioned across. Defaults to `data.length`. |
| `slotOffset` | `number` | no | Slot of `data[0]` within those slots, when `data` is a slice. Defaults to `0`. |

### CandleChartCandleProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `as` | `"div" \| "li"` | yes |  |
| `candle` | `CandleChartData` | yes |  |
| `hitLabel` | `string` | yes |  |
| `index` | `number` | yes | Index reported to the pointer and click callbacks. |
| `x` | `number` | yes | Candle position and width, as percentages of the candle layer. |
| `slot` | `number` | yes |  |
| `min` | `number` | yes |  |
| `max` | `number` | yes |  |
| `interactive` | `boolean` | yes |  |
| `isActive` | `boolean` | yes |  |
| `isSelected` | `boolean` | yes |  |
| `cursorY` | `number \| undefined` | no |  |
| `onCandleClick` | `((index: number) => void) \| undefined` | no |  |
| `onCandlePointerLeave` | `(() => void) \| undefined` | no |  |
| `onCandlePointerMove` | `((position: CandleChartPointerPosition) => void) \| undefined` | no |  |

## Other types

- `CandleChartProps<TAs>`: `RenderableProps<TAs, CandleChartOwnProps, Record<string, never>, HTMLElement>`
- `CandleChartClientProps<TAs>`: `RenderableProps<TAs, CandleChartClientOwnProps, Record<string, never>, HTMLElement>`

## Sub-entries

### `@gunkin/uiify/components/candle-chart/client`

- Runtime: `CandleChartClient`
- Types: `CandleChartClientOwnProps`, `CandleChartClientProps`
