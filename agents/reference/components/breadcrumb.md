<!-- Generated from the package source. Do not edit by hand. -->
# breadcrumb

- Import: `@gunkin/uiify/components/breadcrumb`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `nav>ol`
- Without JavaScript: full
- Types file: `dist/components/breadcrumb.d.ts`
- Related native Element (manifest): [native-details](../elements/native-details.md)
- Note: Ellipsis expand/collapse is a native details/summary disclosure, built on @gunkin/uiify/elements/native-details.

## Related knowledge

- Recipe: [breadcrumb](../../../skills/uiify/references/elements/breadcrumb.md)

## Exports

- Runtime: `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`
- Types: `BreadcrumbItemData`, `BreadcrumbEllipsisProps`, `BreadcrumbLabels`, `BreadcrumbItemProps`, `BreadcrumbLinkOwnProps`, `BreadcrumbLinkProps`, `BreadcrumbListOwnProps`, `BreadcrumbListProps`, `BreadcrumbListSlotProps`, `BreadcrumbOwnProps`, `BreadcrumbPageProps`, `BreadcrumbProps`, `BreadcrumbSeparatorOwnProps`, `BreadcrumbSeparatorProps`

## Props and shapes

### BreadcrumbLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `string` | yes |  |
| `showCollapsed` | `string` | yes |  |

### BreadcrumbOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `Partial<BreadcrumbLabels>` | no |  |

### BreadcrumbItemData

One logical breadcrumb entry. Used by `BreadcrumbList`'s `items` prop — the data-driven alternative to `children` that `maxItems` collapsing requires (see BreadcrumbList's own doc comment for why).

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | yes |  |
| `current` | `boolean` | no | The current page: rendered as BreadcrumbPage, not a link. |
| `href` | `string \| undefined` | no |  |
| `label` | `ReactNode` | yes |  |

### BreadcrumbListOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `labels` | `Partial<BreadcrumbLabels>` | no |  |
| `items` | `readonly BreadcrumbItemData[]` | no | Data-driven items, required to use `maxItems`. Filtering children by element type (`isValidElement` + a type check) can't see through a Fragment-free `.map()` over route data into a custom wrapper component — a real element only becomes visible to a parent's child introspection once React actually renders it, which hasn't happened yet when `BreadcrumbList` itself runs. An explicit array has no such blind spot. |
| `itemsAfterCollapse` | `number` | no |  |
| `itemsBeforeCollapse` | `number` | no |  |
| `maxItems` | `number` | no |  |
| `separator` | `ReactNode` | no | Content of the BreadcrumbSeparator rendered between `items`; none without it. |
| `slotProps` | `BreadcrumbListSlotProps` | no |  |

### BreadcrumbListSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | `RepeatedSlotProps<SlotProps<"li">>` | no |  |
| `link` | `RepeatedSlotProps<SlotProps<"a">>` | no |  |
| `page` | `RepeatedSlotProps<SlotProps<"span">>` | no |  |
| `separator` | `SlotProps<"li">` | no |  |
| `ellipsisItem` | `SlotProps<"li">` | no |  |
| `ellipsis` | `SlotProps<"details">` | no |  |
| `ellipsisTrigger` | `SlotProps<"summary">` | no |  |
| `ellipsisContent` | `SlotProps<"ol">` | no |  |

### BreadcrumbLinkOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `href` | `string \| undefined` | no |  |

### BreadcrumbSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

## Other types

- `BreadcrumbProps<TAs>`: `RenderableProps<TAs, BreadcrumbOwnProps, Record<string, never>, HTMLElement>`
- `BreadcrumbListProps<TAs>`: `RenderableProps<TAs, BreadcrumbListOwnProps, Record<string, never>, HTMLOListElement>`
- `BreadcrumbItemProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLLIElement>`
- `BreadcrumbLinkProps<TAs>`: `RenderableProps<TAs, BreadcrumbLinkOwnProps, Record<string, never>, HTMLAnchorElement>`
- `BreadcrumbPageProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLSpanElement>` — The current page: a `span` with aria-current="page", not a link and not focusable.
- `BreadcrumbSeparatorProps<TAs>`: `RenderableProps<TAs, BreadcrumbSeparatorOwnProps, Record<string, never>, HTMLLIElement>` — A list item between two BreadcrumbItems, hidden from assistive technology.
- `BreadcrumbEllipsisProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLSpanElement>` — A decorative "…" placed inside a BreadcrumbItem by the consumer.
