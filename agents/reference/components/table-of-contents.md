<!-- Generated from the package source. Do not edit by hand. -->
# table-of-contents

- Import: `@gunkin/uiify/components/table-of-contents`
- Tier 2 (Client component — pre-hydration SSR); state source S1; native element `nav + button[popovertarget] + [popover] + a[href]`
- Without JavaScript: pre-hydration-only
- Types file: `dist/components/table-of-contents.d.ts`
- Note: Base entry is a server-pure native navigation shell; /client adds enhancements. Native links and popover invocation/dismissal work without JavaScript.

## Exports

- Runtime: `TableOfContents`, `TableOfContentsRoot`, `TableOfContentsTrigger`, `TableOfContentsRail`, `TableOfContentsIndicator`, `TableOfContentsContent`, `TableOfContentsList`, `TableOfContentsLink`
- Types: `TableOfContentsLevel`, `TableOfContentsRootOwnProps`, `TableOfContentsRootProps`, `TableOfContentsTriggerOwnProps`, `TableOfContentsTriggerProps`, `TableOfContentsRailOwnProps`, `TableOfContentsRailProps`, `TableOfContentsIndicatorOwnProps`, `TableOfContentsIndicatorProps`, `TableOfContentsContentOwnProps`, `TableOfContentsContentProps`, `TableOfContentsListOwnProps`, `TableOfContentsListProps`, `TableOfContentsLinkOwnProps`, `TableOfContentsLinkProps`

## Values

- `TableOfContentsLevel`: `1 | 2 | 3 | 4 | 5 | 6`

## Props and shapes

### TableOfContentsRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TableOfContentsTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes |  |

### TableOfContentsRailOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TableOfContentsIndicatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<HTMLElement>` | no |  |
| `style` | `CSSProperties` | no |  |
| `children` | `ReactNode` | no |  |
| `value` | `string` | yes | Stable target ID matching a Link fragment. |
| `level` | `TableOfContentsLevel` | no |  |
| `selected` | `boolean` | no |  |

### TableOfContentsContentOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes |  |
| `side` | `AnchorSide` | no |  |
| `align` | `AnchorAlign` | no |  |

### TableOfContentsListOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### TableOfContentsLinkOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `style` | `CSSProperties` | no |  |
| `"aria-current"` | `AriaAttributes["aria-current"]` | no |  |
| `children` | `ReactNode` | no |  |
| `href` | `string` | yes | Native same-page anchor; external URLs are not tracked by scrollspy. |
| `level` | `TableOfContentsLevel` | no |  |
| `selected` | `boolean` | no |  |

### TableOfContentsTargetSnapshot

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `start` | `number` | yes |  |
| `visible` | `boolean` | yes |  |

### TableOfContentsScrollSnapshot

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `targets` | `readonly TableOfContentsTargetSnapshot[]` | yes |  |
| `viewportStart` | `number` | yes |  |
| `viewportEnd` | `number` | yes |  |
| `offset` | `number` | yes |  |
| `contentEnd` | `number \| null` | yes |  |

### TableOfContentsObserverOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `HTMLElement` | yes |  |
| `scrollTarget` | `string \| undefined` | no |  |
| `contentTarget` | `string \| undefined` | no |  |
| `offset` | `number` | yes |  |
| `onValueChange` | `(value: string \| null) => void` | yes |  |

### TableOfContentsObserver

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `refresh` | `() => void` | yes |  |
| `destroy` | `() => void` | yes |  |

### TableOfContentsClientRootOwnProps

Extends: `TableOfContentsRootOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `ref` | `Ref<HTMLElement>` | no |  |
| `className` | `string` | no |  |
| `style` | `CSSProperties` | no |  |
| `onClick` | `MouseEventHandler<HTMLElement>` | no |  |
| `scrollSpy` | `boolean` | no |  |
| `scrollTarget` | `string` | no | Scroll-container element ID; omitted tracks the owning window. |
| `contentTarget` | `string` | no | Content element ID used for target scope and end-of-content selection. |
| `offset` | `number` | no |  |
| `value` | `string \| null` | no |  |
| `defaultValue` | `string \| null` | no |  |
| `onValueChange` | `(value: string \| null) => void` | no |  |
| `open` | `boolean` | no |  |
| `defaultOpen` | `boolean` | no | Applied after hydration; the native SSR surface starts closed. |
| `onOpenChange` | `(open: boolean) => void` | no |  |
| `openOnHover` | `boolean` | no |  |
| `openDelay` | `number` | no |  |
| `closeDelay` | `number` | no |  |

### TableOfContentsClientContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | yes |  |
| `open` | `boolean` | yes |  |
| `documentUrl` | `string \| undefined` | yes |  |

### TableOfContentsInteractionOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `HTMLElement` | yes |  |
| `getOpen` | `() => boolean` | yes |  |
| `requestOpen` | `(open: boolean) => void` | yes |  |
| `controlled` | `boolean` | yes |  |
| `openOnHover` | `boolean` | yes |  |
| `openDelay` | `number` | yes |  |
| `closeDelay` | `number` | yes |  |

### TableOfContentsInteractions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `click` | `(event: MouseEvent) => void` | yes |  |
| `destroy` | `() => void` | yes |  |

### TableOfContentsPointerOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `HTMLElement` | yes |  |

## Other types

- `TableOfContentsRootProps<TAs>`: `RenderableProps<TAs, TableOfContentsRootOwnProps, Record<string, never>, HTMLElement>`
- `TableOfContentsTriggerProps<TAs>`: `NativeButtonProps<TAs, TableOfContentsTriggerOwnProps>`
- `TableOfContentsRailProps<TAs>`: `RenderableProps<TAs, TableOfContentsRailOwnProps, Record<string, never>, HTMLElement>`
- `TableOfContentsIndicatorProps<TAs>`: `RenderableProps<TAs, TableOfContentsIndicatorOwnProps, { selected: boolean }, HTMLElement>`
- `TableOfContentsContentProps<TAs>`: `RenderableProps<TAs, TableOfContentsContentOwnProps, Record<string, never>, HTMLElement>`
- `TableOfContentsListProps<TAs>`: `RenderableProps<TAs, TableOfContentsListOwnProps, Record<string, never>, HTMLElement>`
- `TableOfContentsLinkProps<TAs>`: `RenderableProps<TAs, TableOfContentsLinkOwnProps, { selected: boolean }, HTMLAnchorElement>`
- `TableOfContentsClientRootProps<TAs>`: `RenderableProps<TAs, TableOfContentsClientRootOwnProps, { value: string | null; open: boolean }, HTMLElement>`

## Sub-entries

### `@gunkin/uiify/components/table-of-contents/client`

- Runtime: `TableOfContents`, `TableOfContentsRoot`, `TableOfContentsTrigger`, `TableOfContentsContent`, `TableOfContentsLink`, `TableOfContentsIndicator`, `TableOfContentsRail`, `TableOfContentsList`
- Types: `TableOfContentsClientRootOwnProps`, `TableOfContentsClientRootProps`, `TableOfContentsLevel`, `TableOfContentsTriggerProps`, `TableOfContentsRailProps`, `TableOfContentsContentProps`, `TableOfContentsListProps`, `TableOfContentsLinkProps`, `TableOfContentsIndicatorProps`
