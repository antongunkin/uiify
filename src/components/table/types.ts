import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { SlotProps } from "../../core/slot-props.js";
import type { NativeCheckControlSlotProps } from "../internal/native-check-control/types.js";

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
  readonly inBody: boolean;
  readonly interactive: boolean;
  readonly instanceId: string;
  readonly expandedKeys: Set<string>;
  readonly toggleExpanded: (id: string) => void;
  readonly store: TableStore;
}

export interface TableRootOwnProps {
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
  readonly layout?: "auto" | "fixed";
  readonly size?: "sm" | "md" | "lg";
  readonly variant?: "solid" | "outline" | "ghost";
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
  TableStickySectionOwnProps,
  Record<string, never>,
  HTMLTableSectionElement
>;

export type TableBodyProps<TAs extends ElementType = "tbody"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLTableSectionElement
>;

export interface TableRowOwnProps extends TableStickySectionOwnProps {
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

export interface TableColumnHeaderOwnProps extends TableStickyCellOwnProps {
  readonly allowsSorting?: boolean;
  readonly children?: ReactNode;
  readonly id: string;
  readonly onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  readonly sortDirection?: SortDescriptor["direction"] | null;
}

export interface TableRowSelectOwnProps {
  readonly rowId: string;
  readonly slotProps?: TableSelectionSlotProps;
}

export interface TableSelectAllOwnProps {
  readonly slotProps?: TableSelectionSlotProps;
}

export type TableSelectionSlotProps = NativeCheckControlSlotProps;

export interface TableClientColumnHeaderSlotProps {
  readonly sortButton?: SlotProps<"button">;
}

export type TableClientColumnHeaderProps<TAs extends ElementType = "th"> =
  TableColumnHeaderProps<TAs> & {
    readonly slotProps?: TableClientColumnHeaderSlotProps;
  };

export type TableColumnHeaderProps<TAs extends ElementType = "th"> = RenderableProps<
  TAs,
  TableColumnHeaderOwnProps,
  Record<string, never>,
  HTMLTableCellElement
>;

export type TableCellProps<TAs extends ElementType = "td"> = RenderableProps<
  TAs,
  TableStickyCellOwnProps,
  Record<string, never>,
  HTMLTableCellElement
>;

export type TableCaptionProps<TAs extends ElementType = "caption"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLTableCaptionElement
>;

export interface TableClientRootOwnProps extends TableRootOwnProps {
  readonly defaultSelectedKeys?: Iterable<string>;
  readonly defaultSortDescriptor?: SortDescriptor | null;
  readonly onSelectionChange?: (selectedKeys: Set<string>) => void;
  readonly onSortChange?: (descriptor: SortDescriptor | null) => void;
  readonly selectedKeys?: Iterable<string>;
  readonly selectionBehavior?: SelectionBehavior;
  readonly selectionMode?: SelectionMode;
  readonly sortDescriptor?: SortDescriptor | null;
  readonly expandedKeys?: Iterable<string>;
  readonly defaultExpandedKeys?: Iterable<string>;
  readonly onExpandedChange?: (keys: Set<string>) => void;
}
export type TableClientRootProps<TAs extends ElementType = "table"> = RenderableProps<
  TAs,
  TableClientRootOwnProps,
  Record<string, never>,
  HTMLTableElement
>;
export interface TableStickySectionOwnProps {
  readonly sticky?: boolean;
}
export interface TableStickyCellOwnProps {
  readonly align?: "start" | "center" | "end";
  readonly sticky?: "start" | "end";
  readonly children?: ReactNode;
}
export type TableFooterProps<TAs extends ElementType = "tfoot"> = RenderableProps<
  TAs,
  TableStickySectionOwnProps,
  Record<string, never>,
  HTMLTableSectionElement
>;
export type TableRowHeaderProps<TAs extends ElementType = "th"> = RenderableProps<
  TAs,
  TableStickyCellOwnProps,
  Record<string, never>,
  HTMLTableCellElement
>;
export interface TableExpandTriggerProps extends Omit<
  ComponentPropsWithRef<"button">,
  "aria-expanded" | "aria-controls"
> {
  readonly rowId: string;
}
export interface TableExpandedRowProps extends Omit<ComponentPropsWithRef<"tr">, "hidden" | "id"> {
  readonly rowId: string;
}
