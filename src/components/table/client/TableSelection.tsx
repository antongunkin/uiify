"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { NativeCheckControl } from "../../internal/native-check-control/NativeCheckControl.js";
import type { TableRowSelectOwnProps } from "../types.js";
import { useTableContext } from "./table-context.js";

export function TableSelectAll(): ReactElement {
  const { store, instanceId } = useTableContext("SelectAll");
  const selectionState = useSyncExternalStore(
    store.subscribeSelection,
    store.getSelectionState,
    () => "none" as const,
  );
  const checked =
    selectionState === "all" ? true : selectionState === "some" ? "indeterminate" : false;

  const handleChange = useCallback(() => store.toggleSelectAll(), [store]);

  return (
    <NativeCheckControl
      id={`${instanceId}-select-all`}
      label="Select all rows"
      checked={checked}
      onCheckedChange={handleChange}
    />
  );
}
TableSelectAll.displayName = "TableSelectAll";

export function TableRowSelect({ rowId }: TableRowSelectOwnProps): ReactElement {
  const { store, instanceId } = useTableContext("RowSelect");
  const selected = useSyncExternalStore(
    (listener) => store.subscribeRow(rowId, listener),
    () => store.isRowSelected(rowId),
    () => false,
  );

  return (
    <NativeCheckControl
      id={`${instanceId}-row-${rowId}`}
      label="Select row"
      checked={selected}
      onCheckedChange={() => store.toggleRow(rowId)}
    />
  );
}
TableRowSelect.displayName = "TableRowSelect";
