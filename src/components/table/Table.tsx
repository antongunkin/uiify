"use client";

import { createElement, useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import type { ElementType, KeyboardEvent, MouseEvent, ReactElement } from "react";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { RovingFocusItem, RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { Checkbox } from "../checkbox/Checkbox.js";
import type { CheckedState } from "../checkbox/types.js";
import {
  TableBody as TableBodyElement,
  TableCaption,
  TableCell,
  TableColumnHeader as TableColumnHeaderElement,
  TableHeader,
  TableRow as TableRowElement,
} from "./TableShell.js";
import { createTableStore } from "./table-store.js";
import type {
  SortDescriptor,
  TableContextValue,
  TableRootProps,
  TableRowProps,
  TableRowSelectOwnProps,
  TableStore,
} from "./types.js";

export type { SelectionMode, SortDescriptor } from "./types.js";

export { TableCaption, TableCell, TableHeader };

const [TableProvider, useTableContext] = createPartContext<TableContextValue>("Table");

export function TableRoot<TAs extends ElementType = "table">(
  props: TableRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
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
  } = props as TableRootProps<"table">;

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
  const contextValue = useMemo(() => ({ interactive, store }), [interactive, store]);

  const element = useRenderElement({
    as,
    defaultTag: "table",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      role: interactive ? "grid" : undefined,
    },
    render,
    state: {},
  });

  return <TableProvider value={contextValue}>{element}</TableProvider>;
}
TableRoot.displayName = "TableRoot";

export function TableBody(
  props: React.ComponentProps<typeof TableBodyElement>,
): ReactElement | null {
  const { interactive } = useTableContext("Body");
  const { as: _as, render: _render, children, ...consumerProps } = props;

  if (!interactive) {
    return <TableBodyElement {...props} />;
  }

  return (
    <RovingFocusRoot as="tbody" loop orientation="both" {...consumerProps}>
      {children}
    </RovingFocusRoot>
  );
}
TableBody.displayName = "TableBody";

export function TableRow(props: TableRowProps): ReactElement | null {
  const { disabled = false, id, as, render, ...consumerProps } = props;
  const { interactive, store } = useTableContext("Row");
  useIsomorphicLayoutEffect(() => store.registerRow(id), [id, store]);
  useIsomorphicLayoutEffect(() => store.setRowDisabled(id, disabled), [id, disabled, store]);

  const selected = useSyncExternalStore(
    (listener) => store.subscribeRow(id, listener),
    () => store.isRowSelected(id),
    () => false,
  );

  const { onClick: consumerOnClick, onKeyDown: consumerOnKeyDown } = consumerProps as {
    onClick?: (event: MouseEvent<HTMLTableRowElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>) => void;
  };

  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, button, a, [role='checkbox']")) return;
    store.toggleRow(id, {
      disabled,
      metaKey: event.metaKey || event.ctrlKey,
      shiftKey: event.shiftKey,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === " " && interactive) {
      event.preventDefault();
      store.toggleRow(id, { disabled });
    }
  };

  if (interactive) {
    return createElement(RovingFocusItem, {
      disabled,
      id,
      render: (renderProps: Record<string, unknown>) => {
        // T5 — three-way nested composition. `renderProps` is RovingFocusItem's own
        // fully-resolved props (id/aria-disabled/data-current/data-disabled/onFocus/
        // ref/tabIndex, plus its own `onKeyDown` for arrow-key roving + typeahead).
        // Chain innermost first: roving-focus's onKeyDown runs as the outer layer
        // (it never calls preventDefault() for Space), then the real consumer's
        // onKeyDown, then this row's own Space-toggle — preserving Space's today
        // double duty as both a typeahead character and the row-toggle key.
        const { onKeyDown: rovingFocusOnKeyDown, ...restRenderProps } = renderProps as Record<
          string,
          unknown
        > & { onKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>) => void };

        const rowProps = {
          ...consumerProps,
          ...restRenderProps,
          "aria-selected": selected,
          disabled,
          id,
          selected,
          onClick: composeEventHandlers(consumerOnClick, handleClick),
          onKeyDown: composeEventHandlers(
            rovingFocusOnKeyDown,
            composeEventHandlers(consumerOnKeyDown, handleKeyDown),
          ),
        };

        if (render) {
          return createElement(TableRowElement, { ...rowProps, render });
        }
        return createElement(TableRowElement, {
          ...rowProps,
          ...(as !== undefined ? { as } : {}),
        });
      },
    });
  }

  const rowProps = {
    ...consumerProps,
    disabled,
    id,
    selected,
  };

  if (render) {
    return createElement(TableRowElement, { ...rowProps, render });
  }

  return createElement(TableRowElement, {
    ...rowProps,
    ...(as !== undefined ? { as } : {}),
  });
}
TableRow.displayName = "TableRow";

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
    sortDirection: allowsSorting ? (ariaSortForColumn(sortDescriptor, id) ?? null) : null,
  };

  if (allowsSorting) {
    if (render) {
      return (
        <TableColumnHeaderElement
          {...shared}
          onClick={() => store.toggleSort(id)}
          render={render}
        />
      );
    }
    return (
      <TableColumnHeaderElement
        {...shared}
        onClick={() => store.toggleSort(id)}
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

export function TableSelectAll(): ReactElement {
  const { store } = useTableContext("SelectAll");
  const selectionState = useSyncExternalStore(
    store.subscribeSelection,
    store.getSelectionState,
    () => "none" as const,
  );
  const checked: CheckedState =
    selectionState === "all" ? true : selectionState === "some" ? "indeterminate" : false;

  const handleChange = useCallback(() => store.toggleSelectAll(), [store]);

  return (
    <Checkbox
      id="table-select-all"
      label="Select all rows"
      checked={checked}
      onCheckedChange={handleChange}
    />
  );
}
TableSelectAll.displayName = "TableSelectAll";

export function TableRowSelect({ rowId }: TableRowSelectOwnProps): ReactElement {
  const { store } = useTableContext("RowSelect");
  const selected = useSyncExternalStore(
    (listener) => store.subscribeRow(rowId, listener),
    () => store.isRowSelected(rowId),
    () => false,
  );

  return (
    <Checkbox
      id={`table-row-${rowId}`}
      label="Select row"
      checked={selected}
      onCheckedChange={() => store.toggleRow(rowId)}
    />
  );
}
TableRowSelect.displayName = "TableRowSelect";

export const Table = {
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
