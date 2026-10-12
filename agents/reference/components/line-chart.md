<!-- Generated from the package source. Do not edit by hand. -->
# line-chart

- Import: `@gunkin/uiify/components/line-chart`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `figure>ol>li`
- Without JavaScript: full
- Types file: `dist/components/line-chart.d.ts`
- Note: Static line segments are computed during render and expressed as percentage CSS custom properties; the decorative CSS line has an accessible table fallback.

## Exports

- Runtime: `LineChart`
- Types: `LineChartAxisLabel`, `LineChartData`, `LineChartOwnProps`, `LineChartPointerPosition`, `LineChartProps`

## Props and shapes

### LineChartData

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `time` | `string \| number` | yes |  |
| `value` | `number` | yes |  |

### LineChartAxisLabel

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | yes |  |
| `position` | `number` | yes | Position on the axis as a percentage from 0 to 100. |

### LineChartPointerPosition

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |
| `offsetY` | `number` | yes | Pointer offset inside the point hit area, in CSS pixels. |

### LineChartOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"aria-label"` | `string` | no |  |
| `activePointIndex` | `number` | no |  |
| `cursorY` | `number` | no |  |
| `data` | `readonly LineChartData[]` | yes |  |
| `interactive` | `boolean` | no |  |
| `onPointClick` | `(index: number) => void` | no |  |
| `onPointPointerLeave` | `() => void` | no |  |
| `onPointPointerMove` | `(position: LineChartPointerPosition) => void` | no |  |
| `selectedPointIndex` | `number` | no |  |
| `xAxis` | `readonly LineChartAxisLabel[]` | no |  |
| `yAxis` | `readonly LineChartAxisLabel[]` | no |  |

### LineChartClientOwnProps

Extends: `LineChartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `visibleCount` | `number` | no | Live mode: sizes point slots so `visibleCount` fill the viewport and virtualizes the full history with a horizontal VirtualScroll. The chart follows new points while the reader is at the newest one; the value scale, axes, readout, and data table follow the visible points. Zoom is disabled. |

### LineChartViewProps

Internal props the client entry passes to `LineChart`; not part of the public API.

Extends: `LineChartOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `pointLayer` | `ReactNode` | no | Replaces the static point list (e.g. with a virtualized layer). |
| `announceReadout` | `boolean` | no | Announce readout changes; off for streaming data. Defaults to `true`. |
| `slotCount` | `number` | no | Point slots across the content. When set, the crosshair sits at slot centers — `(slotOffset + index + 0.5) / slotCount` — instead of spreading `data` edge to edge. |
| `slotOffset` | `number` | no | Slot of `data[0]` when `data` is a slice. Defaults to `0`. |

### LineChartPointProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `as` | `"div" \| "li"` | yes |  |
| `point` | `LineChartData` | yes |  |
| `previousPoint` | `LineChartData \| undefined` | yes |  |
| `index` | `number` | yes | Index reported to the pointer and click callbacks, and used for x in the static list. |
| `count` | `number` | yes |  |
| `min` | `number` | yes |  |
| `max` | `number` | yes |  |
| `interactive` | `boolean` | yes |  |
| `isActive` | `boolean` | yes |  |
| `isSelected` | `boolean` | yes |  |
| `cursorY` | `number \| undefined` | no |  |
| `onPointClick` | `((index: number) => void) \| undefined` | no |  |
| `onPointPointerLeave` | `(() => void) \| undefined` | no |  |
| `onPointPointerMove` | `((position: LineChartPointerPosition) => void) \| undefined` | no |  |

## Other types

- `LineChartProps<TAs>`: `RenderableProps<TAs, LineChartOwnProps, Record<string, never>, HTMLElement>`
- `LineChartClientProps<TAs>`: `RenderableProps<TAs, LineChartClientOwnProps, Record<string, never>, HTMLElement>`

## Sub-entries

### `@gunkin/uiify/components/line-chart/client`

- Runtime: `LineChartClient`
- Types: `LineChartAxisLabel`, `LineChartClientOwnProps`, `LineChartClientProps`, `LineChartData`, `LineChartOwnProps`, `LineChartPointerPosition`, `LineChartProps`
