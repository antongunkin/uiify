<!-- Generated from the package source. Do not edit by hand. -->
# pagination

- Import: `@gunkin/uiify/components/pagination`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `nav>ol>a`
- Without JavaScript: full
- Types file: `dist/components/pagination.d.ts`

## Exports

- Runtime: `buildPaginationItems`, `Pagination`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationList`, `PaginationRoot`
- Types: `PaginationItemDescriptor`, `PaginationItemType`, `UsePaginationParams`, `PaginationEllipsisProps`, `PaginationEllipsisOwnProps`, `PaginationItemProps`, `PaginationItemOwnProps`, `PaginationLinkOwnProps`, `PaginationLinkProps`, `PaginationListOwnProps`, `PaginationListProps`, `PaginationRootOwnProps`, `PaginationRootProps`, `PaginationLabels`

## Values

- `PaginationItemType`: `"page" | "ellipsis" | "previous" | "next" | "first" | "last"`

## Props and shapes

### PaginationPageItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | yes |  |
| `page` | `number` | yes |  |
| `selected` | `boolean` | yes |  |
| `type` | `"page"` | yes |  |

### PaginationControlItem

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | yes |  |
| `page` | `number` | no |  |
| `selected` | `false` | yes |  |
| `type` | `Exclude<PaginationItemType, "page">` | yes |  |

### PaginationLabels

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `root` | `string` | yes |  |
| `page` | `string` | yes |  |
| `previous` | `string` | yes |  |
| `next` | `string` | yes |  |
| `first` | `string` | yes |  |
| `last` | `string` | yes |  |
| `previousText` | `string` | yes |  |
| `nextText` | `string` | yes |  |
| `firstText` | `string` | yes |  |
| `lastText` | `string` | yes |  |

### UsePaginationParams

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `boundaryCount` | `number` | no |  |
| `count` | `number` | yes |  |
| `defaultPage` | `number` | no |  |
| `disabled` | `boolean` | no |  |
| `onPageChange` | `(page: number) => void` | no |  |
| `page` | `number` | no |  |
| `showFirstLast` | `boolean` | no |  |
| `siblingCount` | `number` | no |  |

### UsePaginationReturn

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `readonly PaginationItem[]` | yes |  |
| `page` | `number` | yes |  |
| `setPage` | `(page: number) => void` | yes |  |

### PaginationContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | yes |  |
| `items` | `readonly PaginationItem[]` | yes |  |
| `labels` | `PaginationLabels` | yes |  |
| `locale` | `string` | no |  |
| `page` | `number` | yes |  |
| `setPage` | `(page: number) => void` | yes |  |

### PaginationRootOwnProps

Extends: `UsePaginationParams`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"aria-label"` | `string` | no |  |
| `children` | `ReactNode` | no |  |
| `getPageHref` | `(page: number) => string` | no |  |
| `labels` | `Partial<PaginationLabels>` | no |  |
| `locale` | `string` | no |  |

### PaginationListOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### PaginationItemOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

### PaginationLinkOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `getPageHref` | `(page: number) => string` | no |  |
| `locale` | `string` | no |  |
| `pageLabelTemplate` | `string` | no |  |
| `page` | `number` | yes |  |
| `selected` | `boolean` | no |  |

### PaginationEllipsisOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |

## Other types

- `PaginationItem`: `PaginationPageItem | PaginationControlItem`
- `PaginationRootProps<TAs>`: `RenderableProps<TAs, PaginationRootOwnProps, { page: number }, HTMLElement>`
- `PaginationListProps<TAs>`: `RenderableProps<TAs, PaginationListOwnProps, Record<string, never>, HTMLOListElement>`
- `PaginationItemProps<TAs>`: `RenderableProps<TAs, PaginationItemOwnProps, Record<string, never>, HTMLLIElement>`
- `PaginationLinkProps<TAs>`: `RenderableProps<TAs, PaginationLinkOwnProps, { selected: boolean }, HTMLElement>`
- `PaginationEllipsisProps<TAs>`: `RenderableProps<TAs, PaginationEllipsisOwnProps, Record<string, never>, HTMLElement>`
