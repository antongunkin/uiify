<!-- Generated from the package source. Do not edit by hand. -->
# line-chart

- Import: `@gunkin/uiify/components/line-chart`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `figure>ol>li`
- Without JavaScript: full
- Types file: `dist/components/line-chart.d.ts`
- Note: Static line segments are computed during render and expressed as percentage CSS custom properties; the decorative CSS line has an accessible table fallback.

## Related knowledge

- Recipe: [line-chart](../../../skills/uiify/references/elements/line-chart.md)

## Exports

- Runtime: `LineChart`
- Types: `LineChartAxisLabel`, `LineChartData`, `LineChartOwnProps`, `LineChartPointerPosition`, `LineChartProps`, `LineChartSlotProps`

## Props and shapes

### LineChartSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `caption` | `SlotProps<"figcaption">` | no |  |
| `readout` | `SlotProps<"div">` | no |  |
| `readoutTime` | `SlotProps<"span">` | no |  |
| `readoutValue` | `SlotProps<"span">` | no |  |
| `plot` | `SlotProps<"div">` | no |  |
| `scrollViewport` | `SlotProps<"div">` | no |  |
| `canvas` | `SlotProps<"div">` | no |  |
| `viewport` | `SlotProps<"div">` | no |  |
| `points` | `SlotProps<"ol">` | no |  |
| `point` | `LineChartIndexedSlotProps<LineChartPointElementProps>` | no |  |
| `pointHit` | `LineChartRepeatedSlotProps<"button">` | no |  |
| `crosshair` | `SlotProps<"div">` | no |  |
| `crosshairMarker` | `SlotProps<"span">` | no |  |
| `timeViewport` | `SlotProps<"div">` | no |  |
| `timeAxis` | `SlotProps<"ol">` | no |  |
| `timeAxisLabel` | `LineChartRepeatedSlotProps<"li">` | no |  |
| `crosshairTime` | `SlotProps<"li">` | no |  |
| `valueAxis` | `SlotProps<"ol">` | no |  |
| `valueAxisLabel` | `LineChartRepeatedSlotProps<"li">` | no |  |
| `crosshairValue` | `SlotProps<"li">` | no |  |
| `liveScrollport` | `SlotProps<"div">` | no |  |
| `liveSpacer` | `SlotProps<"div">` | no |  |
| `livePointRow` | `LineChartRepeatedSlotProps<"div">` | no |  |
| `dataTable` | `SlotProps<"table">` | no |  |
| `dataTableHead` | `SlotProps<"thead">` | no |  |
| `dataTableHeaderRow` | `SlotProps<"tr">` | no |  |
| `dataTableTimeHeader` | `SlotProps<"th">` | no |  |
| `dataTableValueHeader` | `SlotProps<"th">` | no |  |
| `dataTableBody` | `SlotProps<"tbody">` | no |  |
| `dataTableRow` | `LineChartRepeatedSlotProps<"tr">` | no |  |
| `dataTableTimeCell` | `LineChartRepeatedSlotProps<"th">` | no |  |
| `dataTableValueCell` | `LineChartRepeatedSlotProps<"td">` | no |  |

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
| `"aria-label"` | `string \| undefined` | no |  |
| `activePointIndex` | `number` | no |  |
| `cursorY` | `number` | no |  |
| `data` | `readonly LineChartData[]` | yes |  |
| `interactive` | `boolean` | no |  |
| `locale` | `string` | no | BCP 47 locale for default axis labels. Defaults to `"en-US"`. |
| `onPointClick` | `(index: number) => void` | no |  |
| `onPointPointerLeave` | `() => void` | no |  |
| `onPointPointerMove` | `(position: LineChartPointerPosition) => void` | no |  |
| `selectedPointIndex` | `number` | no |  |
| `slotProps` | `LineChartSlotProps` | no |  |
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
| `slotProps` | `Pick<LineChartSlotProps, "point" \| "pointHit"> \| undefined` | no |  |

## Other types

- `LineChartProps<TAs>`: `RenderableProps<TAs, LineChartOwnProps, Record<string, never>, HTMLElement>`
- `LineChartClientProps<TAs>`: `RenderableProps<TAs, LineChartClientOwnProps, Record<string, never>, HTMLElement>`

## Sub-entries

### `@gunkin/uiify/components/line-chart/client`

- Runtime: `LineChartClient`
- Types: `LineChartAxisLabel`, `LineChartClientOwnProps`, `LineChartClientProps`, `LineChartData`, `LineChartOwnProps`, `LineChartPointerPosition`, `LineChartProps`, `LineChartSlotProps`
