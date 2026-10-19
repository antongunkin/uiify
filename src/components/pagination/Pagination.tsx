"use client";

import { useMemo } from "react";
import type { ElementType, MouseEvent, ReactElement } from "react";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { useRenderElement } from "@gunkin/uiify/core/render";
import {
  PaginationEllipsis as PaginationEllipsisElement,
  DEFAULT_PAGINATION_LABELS,
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
    "aria-label": ariaLabel,
    boundaryCount,
    count,
    defaultPage,
    disabled,
    onPageChange,
    page,
    labels,
    locale,
    showFirstLast,
    siblingCount,
    children,
    ...consumerProps
  } = props as PaginationRootProps<"nav">;
  const mergedLabels = { ...DEFAULT_PAGINATION_LABELS, ...labels };

  const {
    items,
    page: currentPage,
    setPage,
  } = usePagination({
    count,
    ...(boundaryCount !== undefined ? { boundaryCount } : {}),
    ...(defaultPage !== undefined ? { defaultPage } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(onPageChange !== undefined ? { onPageChange } : {}),
    ...(page !== undefined ? { page } : {}),
    ...(showFirstLast !== undefined ? { showFirstLast } : {}),
    ...(siblingCount !== undefined ? { siblingCount } : {}),
  });

  const contextValue = useMemo(
    () => ({
      count,
      items,
      labels: mergedLabels,
      ...(locale !== undefined ? { locale } : {}),
      page: currentPage,
      setPage,
    }),
    [count, currentPage, items, labels, locale, setPage],
  );

  const element = useRenderElement({
    as,
    defaultTag: "nav",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel ?? mergedLabels.root,
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
  const { items, labels, locale } = usePaginationContext("List");
  return (
    <>
      {items.map((item, index) => (
        <PaginationItemRenderer
          item={item}
          key={`${item.type}-${item.page ?? index}`}
          labels={labels}
          {...(locale !== undefined ? { locale } : {})}
        />
      ))}
    </>
  );
}
PaginationListItems.displayName = "PaginationListItems";

function PaginationItemRenderer({
  item,
  labels,
  locale,
}: {
  readonly item: PaginationItem;
  readonly labels: PaginationContextValue["labels"];
  readonly locale?: string;
}): ReactElement {
  switch (item.type) {
    case "ellipsis":
      return <PaginationEllipsisElement />;
    case "previous":
      return <PaginationPrevious disabled={item.disabled} labels={labels} />;
    case "next":
      return <PaginationNext disabled={item.disabled} labels={labels} />;
    case "first":
      return <PaginationFirst disabled={item.disabled} labels={labels} />;
    case "last":
      return <PaginationLast disabled={item.disabled} labels={labels} />;
    default:
      return (
        <PaginationItemPart>
          <PaginationLink
            disabled={item.disabled}
            {...(locale !== undefined ? { locale } : {})}
            pageLabelTemplate={labels.page}
            page={item.page ?? 1}
            selected={item.selected}
          />
        </PaginationItemPart>
      );
  }
}
PaginationItemRenderer.displayName = "PaginationItemRenderer";

export function PaginationList(): ReactElement | null {
  const { items, labels, locale } = usePaginationContext("List");

  return (
    <PaginationListElement>
      {items.map((item, index) => (
        <PaginationItemRenderer
          item={item}
          key={`${item.type}-${item.page ?? index}`}
          labels={labels}
          {...(locale !== undefined ? { locale } : {})}
        />
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
    locale,
    pageLabelTemplate,
    page,
    selected = false,
    ...consumerProps
  } = props as PaginationLinkProps<"button">;
  const context = usePaginationContext("Link");
  const { setPage } = context;
  const activeLocale = locale ?? context.locale;
  const activePageLabelTemplate = pageLabelTemplate ?? context.labels.page;
  const onClick = (consumerProps as { onClick?: (event: MouseEvent<HTMLButtonElement>) => void })
    .onClick;

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      "aria-current": selected ? "page" : undefined,
      "aria-label": formatPageLabel(activePageLabelTemplate, page, activeLocale),
      "data-selected": selected ? "" : undefined,
      "data-size": "icon",
      "data-type": "page",
      "data-uiify-button": "",
      "data-variant": "ghost",
      disabled: disabled || undefined,
      onClick: composeEventHandlers(onClick, () => setPage(page)),
      type: "button",
      children: formatPageNumber(page, activeLocale),
    },
    render,
    state: { selected },
  });
}

function PaginationPrevious({
  disabled,
  labels,
}: {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { page, setPage } = usePaginationContext("Previous");
  return (
    <PaginationItemPart>
      <button
        aria-label={labels.previous}
        data-type="previous"
        data-uiify-button=""
        data-variant="ghost"
        disabled={disabled}
        onClick={() => setPage(page - 1)}
        type="button"
      >
        {labels.previousText}
      </button>
    </PaginationItemPart>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
  disabled,
  labels,
}: {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { page, setPage } = usePaginationContext("Next");
  return (
    <PaginationItemPart>
      <button
        aria-label={labels.next}
        data-type="next"
        data-uiify-button=""
        data-variant="ghost"
        disabled={disabled}
        onClick={() => setPage(page + 1)}
        type="button"
      >
        {labels.nextText}
      </button>
    </PaginationItemPart>
  );
}
PaginationNext.displayName = "PaginationNext";

function PaginationFirst({
  disabled,
  labels,
}: {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { setPage } = usePaginationContext("First");
  return (
    <PaginationItemPart>
      <button
        aria-label={labels.first}
        data-type="first"
        data-uiify-button=""
        data-variant="ghost"
        disabled={disabled}
        onClick={() => setPage(1)}
        type="button"
      >
        {labels.firstText}
      </button>
    </PaginationItemPart>
  );
}
PaginationFirst.displayName = "PaginationFirst";

function PaginationLast({
  disabled,
  labels,
}: {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { count, setPage } = usePaginationContext("Last");
  return (
    <PaginationItemPart>
      <button
        aria-label={labels.last}
        data-type="last"
        data-uiify-button=""
        data-variant="ghost"
        disabled={disabled}
        onClick={() => setPage(count)}
        type="button"
      >
        {labels.lastText}
      </button>
    </PaginationItemPart>
  );
}
PaginationLast.displayName = "PaginationLast";

function formatPageNumber(page: number, locale?: string): string {
  return locale ? new Intl.NumberFormat(locale).format(page) : String(page);
}

function formatPageLabel(template: string, page: number, locale?: string): string {
  return formatLabel(template, { page: locale === undefined ? String(page) : page }, locale);
}

export const Pagination = {
  Ellipsis: PaginationEllipsisElement,
  Item: PaginationItemPart,
  Link: PaginationLink,
  List: PaginationList,
  Root: PaginationRoot,
};
