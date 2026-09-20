"use client";

import { useMemo } from "react";
import type { ElementType, MouseEvent, ReactElement } from "react";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { useRenderElement } from "@gunkin/uiify/core/render";
import {
  PaginationEllipsis as PaginationEllipsisElement,
  PaginationItemPart,
  PaginationList as PaginationListElement,
} from "./PaginationShell.js";
import { usePagination } from "./use-pagination.js";
import type {
  PaginationContextValue,
  PaginationItem,
  PaginationLinkProps,
  PaginationRootProps,
} from "./types.js";

export type { PaginationItem } from "./types.js";

export { PaginationEllipsis, PaginationItemPart } from "./PaginationShell.js";

const [PaginationProvider, usePaginationContext] =
  createPartContext<PaginationContextValue>("Pagination");

export function PaginationRoot<TAs extends ElementType = "nav">(
  props: PaginationRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    "aria-label": ariaLabel = "Pagination",
    boundaryCount,
    count,
    defaultPage,
    disabled,
    onChange,
    page,
    showFirstLast,
    siblingCount,
    children,
    ...consumerProps
  } = props as PaginationRootProps<"nav">;

  const {
    items,
    page: currentPage,
    setPage,
  } = usePagination({
    count,
    ...(boundaryCount !== undefined ? { boundaryCount } : {}),
    ...(defaultPage !== undefined ? { defaultPage } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(onChange !== undefined ? { onChange } : {}),
    ...(page !== undefined ? { page } : {}),
    ...(showFirstLast !== undefined ? { showFirstLast } : {}),
    ...(siblingCount !== undefined ? { siblingCount } : {}),
  });

  const contextValue = useMemo(
    () => ({ count, items, page: currentPage, setPage }),
    [count, currentPage, items, setPage],
  );

  const element = useRenderElement({
    as,
    defaultTag: "nav",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel,
      children: children ?? (
        <ol>
          <PaginationListItems />
        </ol>
      ),
      "data-uiify-pagination": "",
    },
    render,
    state: { page: currentPage },
  });

  return <PaginationProvider value={contextValue}>{element}</PaginationProvider>;
}
PaginationRoot.displayName = "PaginationRoot";

function PaginationListItems(): ReactElement {
  const { items } = usePaginationContext("List");
  return (
    <>
      {items.map((item, index) => (
        <PaginationItemRenderer item={item} key={`${item.type}-${item.page ?? index}`} />
      ))}
    </>
  );
}
PaginationListItems.displayName = "PaginationListItems";

function PaginationItemRenderer({ item }: { readonly item: PaginationItem }): ReactElement {
  switch (item.type) {
    case "ellipsis":
      return <PaginationEllipsisElement />;
    case "previous":
      return <PaginationPrevious disabled={item.disabled} />;
    case "next":
      return <PaginationNext disabled={item.disabled} />;
    case "first":
      return <PaginationFirst disabled={item.disabled} />;
    case "last":
      return <PaginationLast disabled={item.disabled} />;
    default:
      return (
        <PaginationItemPart>
          <PaginationLink disabled={item.disabled} page={item.page ?? 1} selected={item.selected} />
        </PaginationItemPart>
      );
  }
}
PaginationItemRenderer.displayName = "PaginationItemRenderer";

export function PaginationList(): ReactElement | null {
  const { items } = usePaginationContext("List");

  return (
    <PaginationListElement>
      {items.map((item, index) => (
        <PaginationItemRenderer item={item} key={`${item.type}-${item.page ?? index}`} />
      ))}
    </PaginationListElement>
  );
}
PaginationList.displayName = "PaginationList";

export function PaginationLink<TAs extends ElementType = "button">(
  props: PaginationLinkProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    disabled = false,
    page,
    selected = false,
    ...consumerProps
  } = props as PaginationLinkProps<"button">;
  const { setPage } = usePaginationContext("Link");
  const onClick = (consumerProps as { onClick?: (event: MouseEvent<HTMLButtonElement>) => void })
    .onClick;

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      "aria-current": selected ? "page" : undefined,
      "aria-label": `Page ${page}`,
      "data-selected": selected ? "" : undefined,
      "data-type": "page",
      disabled: disabled || undefined,
      onClick: composeEventHandlers(onClick, () => setPage(page)),
      type: "button",
      children: page,
    },
    render,
    state: { selected },
  });
}

function PaginationPrevious({ disabled }: { readonly disabled: boolean }): ReactElement {
  const { page, setPage } = usePaginationContext("Previous");
  return (
    <PaginationItemPart>
      <button
        aria-label="Previous page"
        data-type="previous"
        disabled={disabled}
        onClick={() => setPage(page - 1)}
        type="button"
      >
        Previous
      </button>
    </PaginationItemPart>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({ disabled }: { readonly disabled: boolean }): ReactElement {
  const { page, setPage } = usePaginationContext("Next");
  return (
    <PaginationItemPart>
      <button
        aria-label="Next page"
        data-type="next"
        disabled={disabled}
        onClick={() => setPage(page + 1)}
        type="button"
      >
        Next
      </button>
    </PaginationItemPart>
  );
}
PaginationNext.displayName = "PaginationNext";

function PaginationFirst({ disabled }: { readonly disabled: boolean }): ReactElement {
  const { setPage } = usePaginationContext("First");
  return (
    <PaginationItemPart>
      <button
        aria-label="First page"
        data-type="first"
        disabled={disabled}
        onClick={() => setPage(1)}
        type="button"
      >
        First
      </button>
    </PaginationItemPart>
  );
}
PaginationFirst.displayName = "PaginationFirst";

function PaginationLast({ disabled }: { readonly disabled: boolean }): ReactElement {
  const { count, setPage } = usePaginationContext("Last");
  return (
    <PaginationItemPart>
      <button
        aria-label="Last page"
        data-type="last"
        disabled={disabled}
        onClick={() => setPage(count)}
        type="button"
      >
        Last
      </button>
    </PaginationItemPart>
  );
}
PaginationLast.displayName = "PaginationLast";

export const Pagination = {
  Ellipsis: PaginationEllipsisElement,
  Item: PaginationItemPart,
  Link: PaginationLink,
  List: PaginationList,
  Root: PaginationRoot,
};
