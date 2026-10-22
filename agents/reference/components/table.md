<!-- Generated from the package source. Do not edit by hand. -->
# table

- Import: `@gunkin/uiify/components/table`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `table`
- Without JavaScript: full
- Types file: `dist/components/table.d.ts`
- Note: Native semantic Table parts; selection, sorting and expansion use the explicit /client entry.

## Related knowledge

- Recipe: [table](../../../skills/uiify/references/elements/table.md)
- Example: [table-controls](../../../skills/uiify/references/examples/table-controls.md)

## Exports

- Runtime: `Table`, `TableFooter`, `TableRowHeader`, `TableBody`, `TableCaption`, `TableCell`, `TableColumnHeader`, `TableHeader`, `TableRoot`, `TableRow`
- Types: `TableFooterProps`, `TableRowHeaderProps`, `TableStickySectionOwnProps`, `TableStickyCellOwnProps`, `TableBodyProps`, `TableCaptionProps`, `TableCellProps`, `TableColumnHeaderOwnProps`, `TableColumnHeaderProps`, `TableContextValue`, `TableInteractiveRootOwnProps`, `TableHeaderProps`, `TableRowSelectOwnProps`, `TableRowOwnProps`, `TableRowProps`, `TableStore`, `TableStoreOptions`, `TableRootProps`, `SelectionMode`, `SortDescriptor`, `SortDirection`

## Values

- `SortDirection`: `"ascending" | "descending"`
- `SelectionMode`: `"none" | "single" | "multiple"`
- `SelectionBehavior`: `"toggle" | "replace"`

## Props and shapes

### SortDescriptor

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `column` | `string` | yes |  |
| `direction` | `SortDirection` | yes |  |

### TableStoreOptions

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultSelectedKeys` | `Iterable<string>` | no |  |
| `defaultSortDescriptor` | `SortDescriptor \| null` | no |  |
| `onSelectionChange` | `((selectedKeys: Set<string>) => void) \| undefined` | no |  |
| `onSortChange` | `((descriptor: SortDescriptor \| null) => void) \| undefined` | no |  |
| `selectedKeys` | `Iterable<string>` | no |  |
| `selectionBehavior` | `SelectionBehavior` | no |  |
| `selectionMode` | `SelectionMode` | no |  |
| `sortDescriptor` | `SortDescriptor \| null` | no |  |

### TableStore

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `getRowIds` | `() => string[]` | yes |  |
| `getSelectedKeys` | `() => Set<string>` | yes |  |
| `getSelectionState` | `() => "none" \| "some" \| "all"` | yes |  |
| `getServerSelectedSnapshot` | `() => Set<string>` | yes |  |
| `getServerSortSnapshot` | `() => SortDescriptor \| null` | yes |  |
| `getSortSnapshot` | `() => SortDescriptor \| null` | yes |  |
| `isRowSelected` | `(id: string) => boolean` | yes |  |
| `registerRow` | `(id: string) => () => void` | yes |  |
| `setRowDisabled` | `(id: string, disabled: boolean) => void` | yes |  |
| `setRowIds` | `(ids: readonly string[]) => void` | yes |  |
| `setSelectedKeys` | `(keys: Iterable<string>) => void` | yes |  |
| `setSortDescriptor` | `(descriptor: SortDescriptor \| null) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | yes |  |
| `subscribeRow` | `(id: string, listener: () => void) => () => void` | yes |  |
| `subscribeSelection` | `(listener: () => void) => () => void` | yes |  |
| `subscribeSort` | `(listener: () => void) => () => void` | yes |  |
| `syncSelectedKeys` | `(keys: Iterable<string>) => void` | yes |  |
| `syncSortDescriptor` | `(descriptor: SortDescriptor \| null) => void` | yes |  |
| `toggleRow` | `(id: string, toggleOptions?: { readonly disabled?: boolean; readonly metaKey?: boolean; readonly shiftKey?: boolean; }) => void` | yes |  |
| `toggleSelectAll` | `() => void` | yes |  |
| `toggleSort` | `(column: string) => void` | yes |  |
| `updateOptions` | `(nextOptions: TableStoreOptions) => void` | yes |  |

### TableContextValue

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `inBody` | `boolean` | yes |  |
| `interactive` | `boolean` | yes |  |
| `instanceId` | `string` | yes |  |
| `expandedKeys` | `Set<string>` | yes |  |
| `toggleExpanded` | `(id: string) => void` | yes |  |
| `store` | `TableStore` | yes |  |

### TableRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `"aria-label"` | `string` | no |  |
| `"aria-labelledby"` | `string` | no |  |
| `layout` | `"auto" \| "fixed"` | no |  |
| `size` | `"sm" \| "md" \| "lg"` | no |  |
| `variant` | `"solid" \| "outline" \| "ghost"` | no |  |

### TableInteractiveRootOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultSelectedKeys` | `Iterable<string>` | no |  |
| `onSelectionChange` | `(selectedKeys: Set<string>) => void` | no |  |
| `onSortChange` | `(descriptor: SortDescriptor \| null) => void` | no |  |
| `selectedKeys` | `Iterable<string>` | no |  |
| `selectionBehavior` | `SelectionBehavior` | no |  |
| `selectionMode` | `SelectionMode` | no |  |

### TableRowOwnProps

Extends: `TableStickySectionOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no |  |
| `id` | `string` | yes |  |
| `selected` | `boolean` | no |  |

### TableColumnHeaderOwnProps

Extends: `TableStickyCellOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `allowsSorting` | `boolean` | no |  |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes |  |
| `onClick` | `React.MouseEventHandler<HTMLTableCellElement>` | no |  |
| `sortDirection` | `SortDescriptor["direction"] \| null` | no |  |

### TableRowSelectOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `rowId` | `string` | yes |  |

### TableClientRootOwnProps

Extends: `TableRootOwnProps`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `defaultSelectedKeys` | `Iterable<string>` | no |  |
| `defaultSortDescriptor` | `SortDescriptor \| null` | no |  |
| `onSelectionChange` | `(selectedKeys: Set<string>) => void` | no |  |
| `onSortChange` | `(descriptor: SortDescriptor \| null) => void` | no |  |
| `selectedKeys` | `Iterable<string>` | no |  |
| `selectionBehavior` | `SelectionBehavior` | no |  |
| `selectionMode` | `SelectionMode` | no |  |
| `sortDescriptor` | `SortDescriptor \| null` | no |  |
| `expandedKeys` | `Iterable<string>` | no |  |
| `defaultExpandedKeys` | `Iterable<string>` | no |  |
| `onExpandedChange` | `(keys: Set<string>) => void` | no |  |

### TableStickySectionOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `sticky` | `boolean` | no |  |

### TableStickyCellOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `"start" \| "center" \| "end"` | no |  |
| `sticky` | `"start" \| "end"` | no |  |
| `children` | `ReactNode` | no |  |

### TableExpandTriggerProps

Extends: `Omit<ComponentPropsWithRef<"button">, "aria-expanded" | "aria-controls">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `rowId` | `string` | yes |  |

### TableExpandedRowProps

Extends: `Omit<ComponentPropsWithRef<"tr">, "hidden" | "id">`

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `rowId` | `string` | yes |  |

## Other types

- `TableRootProps<TAs>`: `RenderableProps<TAs, TableRootOwnProps, Record<string, never>, HTMLTableElement>`
- `TableHeaderProps<TAs>`: `RenderableProps<TAs, TableStickySectionOwnProps, Record<string, never>, HTMLTableSectionElement>`
- `TableBodyProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLTableSectionElement>`
- `TableRowProps<TAs>`: `RenderableProps<TAs, TableRowOwnProps, { selected: boolean }, HTMLTableRowElement>`
- `TableColumnHeaderProps<TAs>`: `RenderableProps<TAs, TableColumnHeaderOwnProps, Record<string, never>, HTMLTableCellElement>`
- `TableCellProps<TAs>`: `RenderableProps<TAs, TableStickyCellOwnProps, Record<string, never>, HTMLTableCellElement>`
- `TableCaptionProps<TAs>`: `RenderableProps<TAs, { readonly children?: ReactNode }, Record<string, never>, HTMLTableCaptionElement>`
- `TableClientRootProps<TAs>`: `RenderableProps<TAs, TableClientRootOwnProps, Record<string, never>, HTMLTableElement>`
- `TableFooterProps<TAs>`: `RenderableProps<TAs, TableStickySectionOwnProps, Record<string, never>, HTMLTableSectionElement>`
- `TableRowHeaderProps<TAs>`: `RenderableProps<TAs, TableStickyCellOwnProps, Record<string, never>, HTMLTableCellElement>`
