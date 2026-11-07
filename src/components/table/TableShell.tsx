import type { ElementType, ReactElement } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";

import type {
  TableFooterProps,
  TableRowHeaderProps,
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
    layout,
    size,
    variant,
    ...consumerProps
  } = props as TableRootProps<"table">;

  return useRenderElement({
    as,
    defaultTag: "table",
    props: {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...(layout ? { "data-layout": layout } : {}),
      ...(size ? { "data-size": size } : {}),
      ...(variant ? { "data-variant": variant } : {}),
      ...consumerProps,
      className: cn("uiify-table", consumerProps.className),
    },
    render,
    state: {},
  });
}

export function TableHeader<TAs extends ElementType = "thead">(
  props: TableHeaderProps<TAs>,
): ReactElement | null {
  const { as, render, sticky, ...consumerProps } = props as TableHeaderProps<"thead">;
  return useRenderElement({
    as,
    defaultTag: "thead",
    props: {
      "data-sticky": sticky ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-table-header", consumerProps.className),
    },
    render,
    state: {},
  });
}

export function TableBody<TAs extends ElementType = "tbody">(
  props: TableBodyProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as TableBodyProps<"tbody">;
  return useRenderElement({
    as,
    defaultTag: "tbody",
    props: {
      ...consumerProps,
      className: cn("uiify-table-body", consumerProps.className),
      children,
    },
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
    sticky,
    ...consumerProps
  } = props as TableRowProps<"tr">;

  return useRenderElement({
    as,
    defaultTag: "tr",
    props: {
      ...consumerProps,
      "data-sticky": sticky ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-selected": selected ? "" : undefined,
      "data-state": selected ? "selected" : undefined,
      id,
      className: cn("uiify-table-row", consumerProps.className),
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
    align,
    sticky,
    ...consumerProps
  } = props as TableColumnHeaderProps<"th">;

  return useRenderElement({
    as,
    defaultTag: "th",
    props: {
      ...consumerProps,
      "aria-sort": allowsSorting ? (sortDirection ?? "none") : undefined,
      scope: "col",
      ...(align ? { "data-align": align } : {}),
      "data-sticky": sticky,
      className: cn("uiify-table-column-header", consumerProps.className),
      onClick,
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
  const { as, render, children, sticky, align, ...consumerProps } = props as TableCellProps<"td">;
  return useRenderElement({
    as,
    defaultTag: "td",
    props: {
      ...consumerProps,
      ...(align ? { "data-align": align } : {}),
      "data-sticky": sticky,
      className: cn("uiify-table-cell", consumerProps.className),
      children,
    },
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
    props: {
      ...consumerProps,
      className: cn("uiify-table-caption", consumerProps.className),
      children,
    },
    render,
    state: {},
  });
}

export function TableFooter<TAs extends ElementType = "tfoot">(
  props: TableFooterProps<TAs>,
): ReactElement | null {
  const { as, render, sticky, ...consumerProps } = props as TableFooterProps<"tfoot">;
  return useRenderElement({
    as,
    defaultTag: "tfoot",
    props: {
      "data-sticky": sticky ? "" : undefined,
      ...consumerProps,
      className: cn("uiify-table-footer", consumerProps.className),
    },
    render,
    state: {},
  });
}
export function TableRowHeader<TAs extends ElementType = "th">(
  props: TableRowHeaderProps<TAs>,
): ReactElement | null {
  const { as, render, sticky, align, ...consumerProps } = props as TableRowHeaderProps<"th">;
  return useRenderElement({
    as,
    defaultTag: "th",
    props: {
      ...consumerProps,
      ...(align ? { "data-align": align } : {}),
      "data-sticky": sticky,
      className: cn("uiify-table-row-header", consumerProps.className),
      scope: "row",
    },
    render,
    state: {},
  });
}

export const Table = {
  Footer: TableFooter,
  RowHeader: TableRowHeader,
  Body: TableBody,
  Caption: TableCaption,
  Cell: TableCell,
  ColumnHeader: TableColumnHeader,
  Header: TableHeader,
  Root: TableRoot,
  Row: TableRow,
};
