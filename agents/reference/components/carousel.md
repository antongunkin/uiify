<!-- Generated from the package source. Do not edit by hand. -->
# carousel

- Import: `@gunkin/uiify/components/carousel`
- Tier 2 (Client component — pre-hydration SSR); state source none; native element `section > div[scroll-snap]`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/carousel.d.ts`
- Note: The documented interactive carousel uses /client and requires hydration for synchronized controls. The base entry remains a native no-JS scroller with CSS Scroll Snap and fragment navigation; /fade adds client-driven CSS transitions.

## Related knowledge

- Recipe: [carousel](../../../skills/uiify/references/elements/carousel.md)

## Exports

- Runtime: `Carousel`
- Types: `CarouselAxis`, `CarouselItem`, `CarouselLabels`, `CarouselProps`, `CarouselSlotProps`, `CarouselStyle`, `CarouselWithRefProps`

## Values

- `CarouselAxis`: `"inline" | "block"`
- `CarouselReason`: `"previous" | "next" | "dot" | "command" | "scroll" | "drag" | "autoplay" | "controlled" | "items"`

## Props and shapes

### CarouselItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `string` | yes |  |
| `children` | `ReactNode` | yes |  |
| `className` | `string` | no |  |

### CarouselLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `previous` | `string` | yes |  |
| `next` | `string` | yes |  |
| `goToSlide` | `string` | yes |  |
| `navigation` | `string` | yes |  |
| `start` | `string` | yes |  |
| `stop` | `string` | yes |  |
| `slide` | `string` | yes |  |

### CarouselIcons

Visible content for the client entries' buttons. Empty by default: `labels` already supplies each button's accessible name, so a consumer supplies whatever it wants to see — an icon, a glyph, a word — without the component shipping one of its own.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `previous` | `ReactNode` | no |  |
| `next` | `ReactNode` | no |  |

### CarouselStyle

Extends: `CSSProperties`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"--uiify-carousel-slide-size"` | `string` | no |  |
| `"--uiify-carousel-gap"` | `string` | no |  |
| `"--uiify-carousel-fade-duration"` | `string` | no |  |

### CarouselSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `viewport` | `Omit<ComponentPropsWithRef<"div">, "aria-label" \| "children" \| "dangerouslySetInnerHTML" \| "data-part" \| "id" \| "role" \| "tabIndex"> & ConsumerDataAttributes & { readonly "aria-label"?: never; readonly "data-part"?: never; readonly id?: never; readonly role?: never; readonly tabIndex?: never; }` | no |  |
| `slide` | `CarouselRepeatedSlotProps<"div", { readonly "aria-hidden"?: never; readonly "aria-label"?: never; readonly "aria-roledescription"?: never; readonly "data-carousel-index"?: never; readonly "data-part"?: never; readonly "data-state"?: never; readonly id?: never; readonly inert?: never; readonly role?: never; }>` | no |  |
| `slideContent` | `CarouselRepeatedSlotProps<"div", { readonly "data-part"?: never }>` | no |  |
| `rotationControl` | `CarouselRepeatedSlotProps<"button", { readonly "aria-label"?: never; readonly "data-carousel-action"?: never; readonly "data-part"?: never; readonly "data-size"?: never; readonly "data-uiify-button"?: never; readonly "data-variant"?: never; readonly disabled?: never; readonly hidden?: never; readonly type?: never; }>` | no |  |
| `previousControl` | `CarouselRepeatedSlotProps<"button", { readonly "aria-label"?: never; readonly "data-carousel-action"?: never; readonly "data-part"?: never; readonly "data-size"?: never; readonly "data-uiify-button"?: never; readonly "data-variant"?: never; readonly disabled?: never; readonly hidden?: never; readonly type?: never; }>` | no |  |
| `nextControl` | `CarouselRepeatedSlotProps<"button", { readonly "aria-label"?: never; readonly "data-carousel-action"?: never; readonly "data-part"?: never; readonly "data-size"?: never; readonly "data-uiify-button"?: never; readonly "data-variant"?: never; readonly disabled?: never; readonly hidden?: never; readonly type?: never; }>` | no |  |
| `dots` | `Omit<ComponentPropsWithRef<"nav">, "aria-label" \| "children" \| "dangerouslySetInnerHTML" \| "data-part"> & ConsumerDataAttributes & { readonly "aria-label"?: never; readonly "data-part"?: never; }` | no |  |
| `dot` | `CarouselRepeatedSlotProps<"a", { readonly "aria-current"?: never; readonly "aria-label"?: never; readonly "data-carousel-index"?: never; readonly "data-part"?: never; readonly href?: never; }>` | no |  |
| `status` | `Omit<ComponentPropsWithRef<"div">, "aria-atomic" \| "aria-live" \| "children" \| "dangerouslySetInnerHTML" \| "data-part"> & ConsumerDataAttributes & { readonly "aria-atomic"?: never; readonly "aria-live"?: never; readonly "data-part"?: never; }` | no |  |

### CarouselProps

Extends: `Omit<ComponentPropsWithoutRef<"section">, | "aria-label" | "children" | "className" | "data-axis" | "data-enhanced" | "data-mode" | "data-uiify-carousel" | "dangerouslySetInnerHTML" | "defaultValue" | "dir" | "id" | "autoplay" | "afterChange" | "beforeChange" | "mouseDrag" | "onSelect" | "onSwipe" | "rewind" | "swipe" | "style" | "value">`, `ConsumerDataAttributes`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"data-axis"` | `never` | no |  |
| `"data-enhanced"` | `never` | no |  |
| `"data-mode"` | `never` | no |  |
| `"data-uiify-carousel"` | `never` | no |  |
| `id` | `string` | yes |  |
| `items` | `readonly CarouselItem[]` | yes |  |
| `"aria-label"` | `string` | yes |  |
| `axis` | `CarouselAxis` | no |  |
| `dir` | `"ltr" \| "rtl"` | no |  |
| `locale` | `string` | no |  |
| `navigation` | `boolean` | no |  |
| `pagination` | `boolean` | no |  |
| `className` | `string` | no |  |
| `style` | `CarouselStyle` | no |  |
| `labels` | `Partial<CarouselLabels>` | no |  |
| `icons` | `CarouselIcons` | no |  |
| `slotProps` | `CarouselSlotProps` | no |  |

### CarouselWithRefProps

Extends: `CarouselProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<HTMLElement>` | no |  |

### CarouselChange

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `previousIndex` | `number` | yes |  |
| `index` | `number` | yes |  |
| `reason` | `CarouselReason` | yes |  |

### CarouselAutoplayOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `delay` | `number` | no |  |
| `paused` | `boolean` | no |  |
| `cycles` | `number` | no |  |
| `stopOnInteraction` | `boolean` | no |  |

### CarouselClientProps

Extends: `CarouselProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<CarouselClientHandle>` | no |  |
| `defaultValue` | `number` | no |  |
| `value` | `number` | no |  |
| `rewind` | `boolean` | no |  |
| `mouseDrag` | `boolean` | no |  |
| `autoplay` | `boolean \| CarouselAutoplayOptions` | no |  |
| `onSelect` | `(index: number, detail: CarouselChange) => void` | no |  |
| `beforeChange` | `(detail: CarouselChange) => void` | no |  |
| `afterChange` | `(detail: CarouselChange) => void` | no |  |
| `onSwipe` | `(detail: CarouselChange) => void` | no |  |

### FadeCarouselClientProps

Extends: `Omit<CarouselClientProps, "axis">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `swipe` | `boolean` | no |  |

### CarouselClientHandle

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `next` | `() => void` | yes |  |
| `previous` | `() => void` | yes |  |
| `goTo` | `(index: number) => void` | yes |  |
| `start` | `() => void` | yes |  |
| `stop` | `() => void` | yes |  |
| `reset` | `() => void` | yes |  |

### CarouselPage

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | `number` | yes |  |
| `offset` | `number` | yes |  |

### CarouselSnapshot

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `settledIndex` | `number` | yes |  |
| `ready` | `boolean` | yes |  |
| `index` | `number` | yes |  |
| `requestedIndex` | `number \| null` | yes |  |
| `settledChange` | `CarouselChange \| null` | yes |  |
| `pages` | `readonly CarouselPage[]` | yes |  |
| `visibleIndices` | `readonly number[]` | yes |  |
| `atStart` | `boolean` | yes |  |
| `atEnd` | `boolean` | yes |  |
| `moving` | `boolean` | yes |  |
| `interacting` | `boolean` | yes |  |

### CarouselControllerOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultValue` | `number` | yes |  |
| `value` | `number` | no |  |
| `rewind` | `boolean` | yes |  |
| `onSelect` | `CarouselClientProps["onSelect"]` | no |  |
| `beforeChange` | `CarouselClientProps["beforeChange"]` | no |  |
| `afterChange` | `CarouselClientProps["afterChange"]` | no |  |
| `onSwipe` | `CarouselClientProps["onSwipe"]` | no |  |

### CarouselController

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getSnapshot` | `() => CarouselSnapshot` | yes |  |
| `getGeometry` | `() => CarouselGeometry \| undefined` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `goTo` | `(index: number, reason: CarouselReason) => void` | yes |  |
| `next` | `(reason: CarouselReason) => void` | yes |  |
| `previous` | `(reason: CarouselReason) => void` | yes |  |
| `setInteracting` | `(active: boolean) => void` | yes |  |
| `update` | `(options: CarouselControllerOptions) => void` | yes |  |
| `refresh` | `() => void` | yes |  |
| `destroy` | `() => void` | yes |  |

### CarouselGeometry

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `physicalAxis` | `"x" \| "y"` | yes |  |
| `sign` | `1 \| -1` | yes |  |
| `viewportSize` | `number` | yes |  |
| `currentOffset` | `number` | yes |  |
| `itemStarts` | `readonly number[]` | yes |  |
| `itemSizes` | `readonly number[]` | yes |  |

### CarouselObservation

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `geometry` | `CarouselGeometry` | yes |  |
| `visibleIndices` | `readonly number[]` | yes |  |

### CarouselObserver

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `watch` | `(receive: (index: number, visible: readonly number[]) => void) => void` | yes |  |
| `measure` | `(receive: (value: CarouselObservation) => void) => void` | yes |  |
| `destroy` | `() => void` | yes |  |

### CarouselAutoplaySnapshot

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `requested` | `boolean` | yes |  |
| `playing` | `boolean` | yes |  |
| `completedAdvances` | `number` | yes |  |

### CarouselAutoplayController

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getSnapshot` | `() => CarouselAutoplaySnapshot` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `start` | `() => void` | yes |  |
| `stop` | `() => void` | yes |  |
| `reset` | `() => void` | yes |  |
| `update` | `(options: CarouselAutoplayOptions) => void` | yes |  |
| `destroy` | `() => void` | yes |  |

### CarouselPresentation

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `mode` | `"scroll" \| "fade"` | yes |  |
| `snapshot` | `CarouselSnapshot` | yes |  |
| `autoplay` | `CarouselAutoplaySnapshot` | no |  |
| `preserveFallbackFocus` | `boolean` | yes |  |
| `mounted` | `boolean` | yes | True once mounted client-side, even before the controller reports `ready`. |

### CarouselMarkupProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `base` | `CarouselProps` | yes |  |
| `rootRef` | `Ref<HTMLElement>` | no |  |
| `presentation` | `CarouselPresentation` | no |  |

### CarouselClientViewProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `base` | `CarouselProps` | yes |  |
| `rootRef` | `Ref<HTMLElement>` | yes |  |
| `mode` | `"scroll" \| "fade"` | yes |  |
| `controller` | `CarouselController` | no |  |
| `autoplay` | `CarouselAutoplayController` | no |  |

### CarouselCommandController

Actions accepted by native commandfor buttons targeting the root.

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `next` | `() => void` | yes |  |
| `previous` | `() => void` | yes |  |

## Sub-entries

### `@gunkin/uiify/components/carousel/client`

- Runtime: `CarouselClient`
- Types: `CarouselClientProps`, `CarouselClientHandle`, `CarouselAutoplayOptions`, `CarouselChange`, `CarouselReason`

### `@gunkin/uiify/components/carousel/fade`

- Runtime: `FadeCarouselClient`
- Types: `CarouselClientHandle`, `FadeCarouselClientProps`
