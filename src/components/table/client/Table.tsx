"use client";

import { useRef, useId } from "react";
import type { ElementType, ReactElement } from "react";
import { useIsomorphicLayoutEffect, useControllableState } from "@gunkin/uiify/hooks";
import { useRenderElement } from "@gunkin/uiify/core/render";
import {
  TableCaption,
  TableCell,
  TableHeader,
  TableFooter,
  TableRowHeader,
} from "../TableShell.js";
import { TableBody } from "./TableBody.js";
import { TableRow } from "./TableRow.js";
import { TableColumnHeader } from "./TableColumnHeader.js";
import { TableRowSelect, TableSelectAll } from "./TableSelection.js";
import { TableExpandedRow, TableExpandTrigger } from "./TableExpansion.js";
import { TableProvider } from "./table-context.js";
import { createTableStore } from "../table-store.js";
import type { TableClientRootProps, TableStore } from "../types.js";

export type { SelectionMode, SortDescriptor } from "../types.js";
export {
  TableCaption,
  TableCell,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableSelectAll,
  TableRowSelect,
  TableExpandedRow,
  TableExpandTrigger,
};

export function TableRoot<TAs extends ElementType = "table">(
  props: TableClientRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    layout,
    size,
    variant,
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys,
    onExpandedChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    defaultSelectedKeys,
    defaultSortDescriptor,
    onSelectionChange,
    onSortChange,
    selectedKeys,
    selectionBehavior,
    selectionMode = "none",
    sortDescriptor,
    ...consumerProps
  } = props as TableClientRootProps<"table">;

  const instanceId = useId();
  const [expandedKeys, setExpandedKeys] = useControllableState<Set<string>>({
    ...(controlledExpandedKeys !== undefined ? { value: new Set(controlledExpandedKeys) } : {}),
    defaultValue: new Set(defaultExpandedKeys),
    ...(onExpandedChange ? { onChange: onExpandedChange } : {}),
  });
  const toggleExpanded = (id: string) => {
    const keys = new Set(expandedKeys);
    if (keys.has(id)) keys.delete(id);
    else keys.add(id);
    setExpandedKeys(keys);
  };
  const storeRef = useRef<TableStore | null>(null);
  storeRef.current ??= createTableStore({
    selectionMode,
    ...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {}),
    ...(defaultSortDescriptor !== undefined ? { defaultSortDescriptor } : {}),
    ...(onSelectionChange !== undefined ? { onSelectionChange } : {}),
    ...(onSortChange !== undefined ? { onSortChange } : {}),
    ...(selectedKeys !== undefined ? { selectedKeys } : {}),
    ...(sortDescriptor !== undefined ? { sortDescriptor } : {}),
    ...(selectionBehavior !== undefined ? { selectionBehavior } : {}),
  });
  const store = storeRef.current;
  store.updateOptions({
    ...(onSelectionChange !== undefined ? { onSelectionChange } : {}),
    ...(onSortChange !== undefined ? { onSortChange } : {}),
    ...(selectionBehavior !== undefined ? { selectionBehavior } : {}),
    selectionMode,
  });

  useIsomorphicLayoutEffect(() => {
    if (selectedKeys !== undefined) store.syncSelectedKeys(selectedKeys);
  }, [selectedKeys, store]);
  useIsomorphicLayoutEffect(() => {
    if (sortDescriptor !== undefined) store.syncSortDescriptor(sortDescriptor);
  }, [sortDescriptor, store]);

  const interactive = selectionMode !== "none";
  const contextValue = {
    interactive,
    store,
    instanceId,
    expandedKeys,
    toggleExpanded,
    inBody: false,
  };

  const element = useRenderElement({
    as,
    defaultTag: "table",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "data-uiify-table": "",
      ...(layout ? { "data-layout": layout } : {}),
      ...(size ? { "data-size": size } : {}),
      ...(variant ? { "data-variant": variant } : {}),
      role: interactive ? "grid" : undefined,
    },
    render,
    state: {},
  });

  return <TableProvider value={contextValue}>{element}</TableProvider>;
}
TableRoot.displayName = "TableRoot";

export const Table = {
  Footer: TableFooter,
  RowHeader: TableRowHeader,
  ExpandTrigger: TableExpandTrigger,
  ExpandedRow: TableExpandedRow,
  Body: TableBody,
  Caption: TableCaption,
  Cell: TableCell,
  ColumnHeader: TableColumnHeader,
  Header: TableHeader,
  Root: TableRoot,
  Row: TableRow,
  RowSelect: TableRowSelect,
  SelectAll: TableSelectAll,
};
