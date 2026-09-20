import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type SortDirection = "ascending" | "descending";

export interface SortDescriptor {
  readonly column: string;
  readonly direction: SortDirection;
}

export type SelectionMode = "none" | "single" | "multiple";
export type SelectionBehavior = "toggle" | "replace";

export interface TableStoreOptions {
  readonly defaultSelectedKeys?: Iterable<string>;
  readonly defaultSortDescriptor?: SortDescriptor | null;
  readonly onSelectionChange?: ((selectedKeys: Set<string>) => void) | undefined;
  readonly onSortChange?: ((descriptor: SortDescriptor | null) => void) | undefined;
  readonly selectedKeys?: Iterable<string>;
  readonly selectionBehavior?: SelectionBehavior;
  readonly selectionMode?: SelectionMode;
  readonly sortDescriptor?: SortDescriptor | null;
}

export interface TableStore {
  readonly getRowIds: () => string[];
  readonly getSelectedKeys: () => Set<string>;
  readonly getSelectionState: () => "none" | "some" | "all";
  readonly getServerSelectedSnapshot: () => Set<string>;
  readonly getServerSortSnapshot: () => SortDescriptor | null;
  readonly getSortSnapshot: () => SortDescriptor | null;
  readonly isRowSelected: (id: string) => boolean;
  readonly registerRow: (id: string) => () => void;
  readonly setRowDisabled: (id: string, disabled: boolean) => void;
  readonly setRowIds: (ids: readonly string[]) => void;
  readonly setSelectedKeys: (keys: Iterable<string>) => void;
  readonly setSortDescriptor: (descriptor: SortDescriptor | null) => void;
  readonly subscribe: (listener: () => void) => () => void;
  readonly subscribeRow: (id: string, listener: () => void) => () => void;
  readonly subscribeSelection: (listener: () => void) => () => void;
  readonly subscribeSort: (listener: () => void) => () => void;
  readonly syncSelectedKeys: (keys: Iterable<string>) => void;
  readonly syncSortDescriptor: (descriptor: SortDescriptor | null) => void;
  readonly toggleRow: (
    id: string,
    toggleOptions?: {
      readonly disabled?: boolean;
      readonly metaKey?: boolean;
      readonly shiftKey?: boolean;
    },
  ) => void;
  readonly toggleSelectAll: () => void;
  readonly toggleSort: (column: string) => void;
  readonly updateOptions: (nextOptions: TableStoreOptions) => void;
}

export interface TableContextValue {
  readonly interactive: boolean;
  readonly store: TableStore;
}

export interface TableRootOwnProps {
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
  readonly defaultSelectedKeys?: Iterable<string>;
  readonly defaultSortDescriptor?: SortDescriptor | null;
  readonly onSelectionChange?: (selectedKeys: Set<string>) => void;
  readonly onSortChange?: (descriptor: SortDescriptor | null) => void;
  readonly selectedKeys?: Iterable<string>;
  readonly selectionBehavior?: SelectionBehavior;
  readonly selectionMode?: SelectionMode;
  readonly sortDescriptor?: SortDescriptor | null;
}

export interface TableInteractiveRootOwnProps {
  readonly defaultSelectedKeys?: Iterable<string>;
  readonly onSelectionChange?: (selectedKeys: Set<string>) => void;
  readonly onSortChange?: (descriptor: SortDescriptor | null) => void;
  readonly selectedKeys?: Iterable<string>;
  readonly selectionBehavior?: SelectionBehavior;
  readonly selectionMode?: SelectionMode;
}

export type TableRootProps<TAs extends ElementType = "table"> = RenderableProps<
  TAs,
  TableRootOwnProps,
  Record<string, never>,
  HTMLTableElement
>;

export type TableHeaderProps<TAs extends ElementType = "thead"> = RenderableProps<
  TAs,
  object,
  Record<string, never>,
  HTMLTableSectionElement
>;

export type TableBodyProps<TAs extends ElementType = "tbody"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLTableSectionElement
>;

export interface TableRowOwnProps {
  readonly disabled?: boolean;
  readonly id: string;
  readonly selected?: boolean;
}

export type TableRowProps<TAs extends ElementType = "tr"> = RenderableProps<
  TAs,
  TableRowOwnProps,
  { selected: boolean },
  HTMLTableRowElement
>;

export interface TableColumnHeaderOwnProps {
  readonly allowsSorting?: boolean;
  readonly children?: ReactNode;
  readonly id: string;
  readonly onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  readonly sortDirection?: SortDescriptor["direction"] | null;
}

export interface TableRowSelectOwnProps {
  readonly rowId: string;
}

export type TableColumnHeaderProps<TAs extends ElementType = "th"> = RenderableProps<
  TAs,
  TableColumnHeaderOwnProps,
  Record<string, never>,
  HTMLTableCellElement
>;

export type TableCellProps<TAs extends ElementType = "td"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLTableCellElement
>;

export type TableCaptionProps<TAs extends ElementType = "caption"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLTableCaptionElement
>;
