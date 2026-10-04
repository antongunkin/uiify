"use client";

import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { TableColumnHeader as TableColumnHeaderElement } from "../TableShell.js";
import type { SortDescriptor } from "../types.js";
import { useTableContext } from "./table-context.js";

function ariaSortForColumn(
  descriptor: SortDescriptor | null,
  column: string,
): SortDescriptor["direction"] | undefined {
  if (!descriptor || descriptor.column !== column) return undefined;
  return descriptor.direction;
}

export function TableColumnHeader(
  props: React.ComponentProps<typeof TableColumnHeaderElement>,
): ReactElement | null {
  const { allowsSorting = false, id, onClick, as, render, ...rest } = props;
  const { store } = useTableContext("ColumnHeader");
  const sortDescriptor = useSyncExternalStore(
    store.subscribeSort,
    store.getSortSnapshot,
    store.getServerSortSnapshot,
  );

  const shared = {
    ...rest,
    allowsSorting,
    id,
    children: allowsSorting ? <button type="button">{rest.children}</button> : rest.children,
    sortDirection: allowsSorting ? (ariaSortForColumn(sortDescriptor, id) ?? null) : null,
  };

  if (allowsSorting) {
    if (render) {
      return (
        <TableColumnHeaderElement
          {...shared}
          onClick={composeEventHandlers(onClick, () => store.toggleSort(id))}
          render={render}
        />
      );
    }
    return (
      <TableColumnHeaderElement
        {...shared}
        onClick={composeEventHandlers(onClick, () => store.toggleSort(id))}
        {...(as !== undefined ? { as } : {})}
      />
    );
  }

  if (render) {
    return (
      <TableColumnHeaderElement
        {...shared}
        {...(onClick !== undefined ? { onClick } : {})}
        render={render}
      />
    );
  }

  return (
    <TableColumnHeaderElement
      {...shared}
      {...(onClick !== undefined ? { onClick } : {})}
      {...(as !== undefined ? { as } : {})}
    />
  );
}
TableColumnHeader.displayName = "TableColumnHeader";
