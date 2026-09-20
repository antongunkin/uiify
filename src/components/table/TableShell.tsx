import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";

import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableRowProps,
  TableColumnHeaderProps,
  TableHeaderProps,
  TableRootProps,
} from "./types.js";

export type { SelectionMode, SortDescriptor } from "./types.js";

export function TableRoot<TAs extends ElementType = "table">(
  props: TableRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    defaultSortDescriptor: _defaultSortDescriptor,
    sortDescriptor: _sortDescriptor,
    ...consumerProps
  } = props as TableRootProps<"table">;

  return useRenderElement({
    as,
    defaultTag: "table",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "data-uiify-table": "",
    },
    render,
    state: {},
  });
}

export function TableHeader<TAs extends ElementType = "thead">(
  props: TableHeaderProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as TableHeaderProps<"thead">;
  return useRenderElement({ as, defaultTag: "thead", props: consumerProps, render, state: {} });
}

export function TableBody<TAs extends ElementType = "tbody">(
  props: TableBodyProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as TableBodyProps<"tbody">;
  return useRenderElement({
    as,
    defaultTag: "tbody",
    props: { ...consumerProps, children },
    render,
    state: {},
  });
}

export function TableRow<TAs extends ElementType = "tr">(
  props: TableRowProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    disabled = false,
    id,
    selected = false,
    ...consumerProps
  } = props as TableRowProps<"tr">;

  return useRenderElement({
    as,
    defaultTag: "tr",
    props: {
      ...consumerProps,
      "data-disabled": disabled ? "" : undefined,
      "data-selected": selected ? "" : undefined,
      "data-state": selected ? "selected" : undefined,
      id,
    },
    render,
    state: { selected },
  });
}

export function TableColumnHeader<TAs extends ElementType = "th">(
  props: TableColumnHeaderProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    allowsSorting = false,
    children,
    id,
    onClick,
    sortDirection,
    ...consumerProps
  } = props as TableColumnHeaderProps<"th">;

  return useRenderElement({
    as,
    defaultTag: "th",
    props: {
      ...consumerProps,
      "aria-sort": allowsSorting ? (sortDirection ?? "none") : undefined,
      onClick,
      scope: "col",
      children,
      id,
    },
    render,
    state: {},
  });
}

export function TableCell<TAs extends ElementType = "td">(
  props: TableCellProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as TableCellProps<"td">;
  return useRenderElement({
    as,
    defaultTag: "td",
    props: { ...consumerProps, children },
    render,
    state: {},
  });
}

export function TableCaption<TAs extends ElementType = "caption">(
  props: TableCaptionProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as TableCaptionProps<"caption">;
  return useRenderElement({
    as,
    defaultTag: "caption",
    props: { ...consumerProps, children },
    render,
    state: {},
  });
}

export const Table = {
  Body: TableBody,
  Caption: TableCaption,
  Cell: TableCell,
  ColumnHeader: TableColumnHeader,
  Header: TableHeader,
  Root: TableRoot,
  Row: TableRow,
};
