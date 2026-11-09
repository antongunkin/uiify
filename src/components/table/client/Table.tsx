"use client";

import { useId, useState } from "react";
import type { ElementType, ReactElement } from "react";
import { useIsomorphicLayoutEffect, useControllableState } from "@gunkin/uiify/hooks";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import {
  TableCaption,
  TableCell,
  TableHeader,
  TableFooter,
  TableRowHeader,
} from "../TableShell.js";
import { TableBody } from "./TableBody.js";
import { TableRow } from "./TableRow.js";
import { TableHead } from "./TableHead.js";
import { TableRowSelect, TableSelectAll } from "./TableSelection.js";
import { TableExpandedRow, TableExpandTrigger } from "./TableExpansion.js";
import { TableProvider } from "./table-context.js";
import { createTableStore } from "../table-store.js";
import type { TableClientProps } from "../types.js";

export type { SelectionMode, SortDescriptor } from "../types.js";
export {
  TableCaption,
  TableCell,
  TableHeader,
  TableFooter,
  TableRowHeader,
  TableBody,
  TableRow,
  TableHead,
  TableSelectAll,
  TableRowSelect,
  TableExpandedRow,
  TableExpandTrigger,
};

export function Table<TAs extends ElementType = "table">(
  props: TableClientProps<TAs>,
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
  } = props as TableClientProps<"table">;

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
  const [store] = useState(() =>
    createTableStore({
      selectionMode,
      ...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {}),
      ...(defaultSortDescriptor !== undefined ? { defaultSortDescriptor } : {}),
      ...(onSelectionChange !== undefined ? { onSelectionChange } : {}),
      ...(onSortChange !== undefined ? { onSortChange } : {}),
      ...(selectedKeys !== undefined ? { selectedKeys } : {}),
      ...(sortDescriptor !== undefined ? { sortDescriptor } : {}),
      ...(selectionBehavior !== undefined ? { selectionBehavior } : {}),
    }),
  );
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
      ...(layout ? { "data-layout": layout } : {}),
      ...(size ? { "data-size": size } : {}),
      ...(variant ? { "data-variant": variant } : {}),
      role: interactive ? "grid" : undefined,
      className: cn("uiify-table", consumerProps.className),
    },
    render,
    state: {},
  });

  return <TableProvider value={contextValue}>{element}</TableProvider>;
}
Table.displayName = "Table";
