<!-- Generated from the package source. Do not edit by hand. -->
# virtual-scroll

- Import: `@gunkin/uiify/components/virtual-scroll`
- Tier 2 (Client component — pre-hydration SSR); state source none; native element `div[overflow]`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/virtual-scroll.d.ts`

## Related knowledge

- Recipe: [virtual-scroll](../../../skills/uiify/references/elements/virtual-scroll.md)

## Exports

- Runtime: `VirtualScroll`, `VIRTUAL_SCROLL_ANCHOR_THRESHOLD`, `VIRTUAL_SCROLL_OVERSCAN`, `VIRTUAL_SCROLL_ROW_HEIGHT`, `VIRTUAL_SCROLL_SCROLL_RESET_DELAY`
- Types: `VirtualScrollAnchor`, `VirtualScrollHandle`, `VirtualScrollItem`, `VirtualScrollListRole`, `VirtualScrollOrientation`, `VirtualScrollOwnProps`, `VirtualScrollRangeChange`, `VirtualScrollRowSlot`, `VirtualScrollRowSlotProps`, `VirtualScrollScrollAlign`, `VirtualScrollScrollBehavior`, `VirtualScrollScrollBehaviorOptions`, `VirtualScrollScrollState`, `VirtualScrollScrollToIndexOptions`, `VirtualScrollSpacerSlotProps`, `VirtualScrollSlotProps`

## Values

- `VirtualScrollListRole`: `"list" | "grid"`
- `VirtualScrollAnchor`: `"start" | "end"`
- `VirtualScrollOrientation`: `"vertical" | "horizontal"` — Scroll axis. Row size props (`rowHeight`, `estimateRowHeight`) measure along this axis.
- `VirtualScrollScrollAlign`: `"start" | "center" | "end" | "auto"`
- `VirtualScrollScrollBehavior`: `"auto" | "instant" | "smooth"`

## Props and shapes

### VirtualScrollItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |

### VirtualScrollSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `row` | `VirtualScrollRowSlotProps` | no |  |
| `spacer` | `VirtualScrollSpacerSlotProps` | no |  |

### VirtualScrollScrollBehaviorOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `behavior` | `VirtualScrollScrollBehavior` | no |  |

### VirtualScrollScrollToIndexOptions

Extends: `VirtualScrollScrollBehaviorOptions`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `VirtualScrollScrollAlign` | no |  |

### VirtualScrollRangeChange

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `startIndex` | `number` | yes | First visible row index (no overscan). |
| `endIndex` | `number` | yes | Last visible row index, inclusive (no overscan). |
| `overscanStart` | `number` | yes | First rendered row index including overscan. |
| `overscanEnd` | `number` | yes | Last rendered row index, inclusive, including overscan. |

### VirtualScrollScrollState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `isScrolling` | `boolean` | yes |  |

### VirtualScrollHandle

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `element` | `HTMLDivElement \| null` | yes |  |
| `scrollToIndex` | `scrollToIndex(index: number, options?: VirtualScrollScrollToIndexOptions): void` | yes |  |
| `scrollToOffset` | `scrollToOffset(offset: number, options?: VirtualScrollScrollBehaviorOptions): void` | yes |  |
| `scrollToEnd` | `scrollToEnd(options?: VirtualScrollScrollBehaviorOptions): void` | yes |  |

### VirtualScrollOwnProps

Extends: `Omit<ComponentPropsWithoutRef<"div">, "children">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<HTMLDivElement>` | no |  |
| `items` | `readonly T[]` | yes |  |
| `height` | `number` | no | Scrollport height; also the viewport extent used before the first resize measurement. |
| `rowHeight` | `number` | no | Fixed item size along the scroll axis — row height when vertical, item width when horizontal. |
| `orientation` | `VirtualScrollOrientation` | no |  |
| `overscan` | `number` | no |  |
| `className` | `string \| undefined` | no |  |
| `testId` | `string` | no |  |
| `renderRow` | `(item: T, index: number) => ReactNode` | yes |  |
| `scrollRef` | `Ref<VirtualScrollHandle>` | no |  |
| `estimateRowHeight` | `(index: number) => number` | no |  |
| `onRangeChange` | `(range: VirtualScrollRangeChange) => void` | no |  |
| `anchor` | `VirtualScrollAnchor` | no |  |
| `followAppend` | `boolean \| "smooth"` | no |  |
| `onScrollStateChange` | `(state: VirtualScrollScrollState) => void` | no |  |
| `isScrollingResetDelay` | `number` | no |  |
| `slotProps` | `VirtualScrollSlotProps` | no |  |

### VirtualScrollRowShellProps

Extends: `SlotProps<"div">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | yes |  |
| `dynamicLayout` | `boolean` | yes |  |
| `index` | `number` | yes |  |
| `itemCount` | `number` | yes |  |
| `listRole` | `VirtualScrollListRole` | yes |  |
| `rowOffset` | `number` | no |  |
| `rowHeight` | `number` | no |  |
| `slotIndex` | `number` | yes |  |

### VirtualScrollRowSlot

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `slotIndex` | `number` | yes |  |
| `index` | `number` | yes |  |
| `item` | `T \| null` | yes |  |

## Other types

- `VirtualScrollRowSlotProps`: `RepeatedSlotProps<SlotProps<"div">> & { readonly byItemIndex?: Readonly<Record<number, SlotProps<"div">>>; }`
- `VirtualScrollSpacerSlotProps`: `SlotProps<"div">`
