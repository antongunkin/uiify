<!-- Generated from the package source. Do not edit by hand. -->
# breadcrumb

- Import: `@gunkin/uiify/components/breadcrumb`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `nav>ol`
- Without JavaScript: full
- Types file: `dist/components/breadcrumb.d.ts`
- Related native Element (manifest): [details](../elements/details.md)
- Note: Ellipsis expand/collapse is a native details/summary disclosure, built on @gunkin/uiify/elements/details.

## Related knowledge

- Recipe: [breadcrumb](../../../skills/uiify/references/elements/breadcrumb.md)

## Exports

- Runtime: `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbRoot`, `BreadcrumbSeparator`
- Types: `BreadcrumbItemData`, `BreadcrumbEllipsisPartProps`, `BreadcrumbLabels`, `BreadcrumbItemProps`, `BreadcrumbLinkOwnProps`, `BreadcrumbLinkProps`, `BreadcrumbListOwnProps`, `BreadcrumbListProps`, `BreadcrumbListSlotProps`, `BreadcrumbRootOwnProps`, `BreadcrumbRootProps`, `BreadcrumbSeparatorOwnProps`, `BreadcrumbSeparatorProps`

## Props and shapes

### BreadcrumbLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `string` | yes |  |
| `showCollapsed` | `string` | yes |  |

### BreadcrumbRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `Partial<BreadcrumbLabels>` | no |  |

### BreadcrumbItemData

One logical breadcrumb entry. Used by `BreadcrumbList`'s `items` prop — the data-driven alternative to `children` that `maxItems` collapsing requires (see BreadcrumbList's own doc comment for why).

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | yes |  |
| `current` | `boolean` | no |  |
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
| `separator` | `ReactNode` | no |  |
| `slotProps` | `BreadcrumbListSlotProps` | no |  |

### BreadcrumbListSlotProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | `RepeatedSlotProps<SlotProps<"li">>` | no |  |
| `link` | `RepeatedSlotProps<SlotProps<"a">>` | no |  |
| `ellipsisItem` | `SlotProps<"li">` | no |  |
| `ellipsis` | `SlotProps<"details">` | no |  |
| `ellipsisTrigger` | `SlotProps<"summary">` | no |  |
| `ellipsisContent` | `SlotProps<"ol">` | no |  |

### BreadcrumbLinkOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `current` | `boolean` | no |  |
| `href` | `string \| undefined` | no |  |

### BreadcrumbSeparatorOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### BreadcrumbEllipsisProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `hiddenItems` | `readonly BreadcrumbItemData[]` | yes |  |
| `labels` | `BreadcrumbLabels` | yes |  |
| `separator` | `ReactNode` | no |  |
| `slotProps` | `BreadcrumbListSlotProps` | no |  |

### BreadcrumbEllipsisPartProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `slotProps` | `{ readonly item?: SlotProps<"li">; readonly ellipsis?: SlotProps<"span">; }` | no |  |

## Other types

- `BreadcrumbRootProps<TAs>`: `RenderableProps<TAs, BreadcrumbRootOwnProps, Record<string, never>, HTMLElement>`
- `BreadcrumbListProps<TAs>`: `RenderableProps<TAs, BreadcrumbListOwnProps, Record<string, never>, HTMLOListElement>`
- `BreadcrumbItemProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLLIElement>`
- `BreadcrumbLinkProps<TAs>`: `RenderableProps<TAs, BreadcrumbLinkOwnProps, { current: boolean }, HTMLAnchorElement>`
- `BreadcrumbSeparatorProps<TAs>`: `RenderableProps<TAs, BreadcrumbSeparatorOwnProps, Record<string, never>, HTMLElement>`
