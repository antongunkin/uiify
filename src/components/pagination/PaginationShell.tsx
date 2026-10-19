import type { ElementType, ReactElement } from "react";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { buildPaginationItems } from "./pagination-engine.js";

import type {
  PaginationItem,
  PaginationLabels,
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationEllipsisProps,
} from "./types.js";

export { buildPaginationItems } from "./pagination-engine.js";

export const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  root: "Pagination",
  page: "Page {page}",
  previous: "Previous page",
  next: "Next page",
  first: "First page",
  last: "Last page",
  previousText: "Previous",
  nextText: "Next",
  firstText: "First",
  lastText: "Last",
};

export function PaginationRoot<TAs extends ElementType = "nav">(
  props: PaginationRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    "aria-label": ariaLabel,
    boundaryCount = 1,
    count,
    disabled = false,
    getPageHref,
    labels,
    locale,
    page = 1,
    showFirstLast = false,
    siblingCount = 1,
    children,
    defaultPage: _defaultPage,
    onPageChange: _onPageChange,
    ...consumerProps
  } = props as PaginationRootProps<"nav">;
  const mergedLabels = { ...DEFAULT_PAGINATION_LABELS, ...labels };

  const items = buildPaginationItems(
    count,
    page,
    siblingCount,
    boundaryCount,
    disabled,
    showFirstLast,
  );

  const content = children ?? (
    <ol>
      {items.map((item, index) => (
        <PaginationItemRenderer
          item={item}
          key={`${item.type}-${item.page ?? index}`}
          labels={mergedLabels}
          {...(locale !== undefined ? { locale } : {})}
          page={page}
          {...paginationHrefProps(getPageHref)}
        />
      ))}
    </ol>
  );

  return useRenderElement({
    as,
    defaultTag: "nav",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel ?? mergedLabels.root,
      children: content,
      "data-uiify-pagination": "",
    },
    render,
    state: { page },
  });
}
PaginationRoot.displayName = "PaginationRoot";

function paginationHrefProps(getPageHref?: (page: number) => string): {
  readonly getPageHref?: (page: number) => string;
} {
  return getPageHref ? { getPageHref } : {};
}

function PaginationItemRenderer({
  getPageHref,
  item,
  labels,
  locale,
  page,
}: {
  readonly getPageHref?: (page: number) => string;
  readonly item: PaginationItem;
  readonly labels: PaginationLabels;
  readonly locale?: string;
  readonly page: number;
}): ReactElement {
  const hrefProps = paginationHrefProps(getPageHref);

  switch (item.type) {
    case "ellipsis":
      return <PaginationEllipsis />;
    case "previous":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label={labels.previous}
          labelText={labels.previousText}
          page={page - 1}
          type="previous"
          {...hrefProps}
        />
      );
    case "next":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label={labels.next}
          labelText={labels.nextText}
          page={page + 1}
          type="next"
          {...hrefProps}
        />
      );
    case "first":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label={labels.first}
          labelText={labels.firstText}
          page={1}
          type="first"
          {...hrefProps}
        />
      );
    case "last":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label={labels.last}
          labelText={labels.lastText}
          page={item.page ?? page}
          type="last"
          {...hrefProps}
        />
      );
    default:
      return (
        <PaginationLink
          disabled={item.disabled}
          {...(locale !== undefined ? { locale } : {})}
          pageLabelTemplate={labels.page}
          page={item.page ?? 1}
          selected={item.selected}
          {...hrefProps}
        />
      );
  }
}
PaginationItemRenderer.displayName = "PaginationItemRenderer";

export function PaginationList<TAs extends ElementType = "ol">(
  props: PaginationListProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as PaginationListProps<"ol">;

  return useRenderElement({
    as,
    defaultTag: "ol",
    props: consumerProps,
    render,
    state: {},
  });
}

export function PaginationItemPart<TAs extends ElementType = "li">(
  props: PaginationItemProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as PaginationItemProps<"li">;

  return useRenderElement({
    as,
    defaultTag: "li",
    props: { ...consumerProps, children },
    render,
    state: {},
  });
}

export function PaginationLink<TAs extends ElementType = "a">(
  props: PaginationLinkProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    disabled = false,
    getPageHref,
    locale,
    pageLabelTemplate = DEFAULT_PAGINATION_LABELS.page,
    page,
    selected = false,
    ...consumerProps
  } = props as PaginationLinkProps<"a">;

  const href = !disabled && getPageHref ? getPageHref(page) : undefined;
  const Tag = href ? "a" : "span";

  return useRenderElement({
    as: as ?? Tag,
    defaultTag: Tag,
    props: {
      ...consumerProps,
      "aria-current": selected ? "page" : undefined,
      "aria-label": formatPageLabel(pageLabelTemplate, page, locale),
      "aria-disabled": disabled ? true : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-selected": selected ? "" : undefined,
      "data-size": "icon",
      "data-type": "page",
      "data-uiify-button": "",
      "data-variant": "ghost",
      href,
      children: formatPageNumber(page, locale),
    },
    render,
    state: { selected },
  });
}

function PaginationNavControl({
  disabled,
  getPageHref,
  label,
  labelText,
  page,
  type,
}: {
  readonly disabled: boolean;
  readonly getPageHref?: (page: number) => string;
  readonly label: string;
  readonly labelText: string;
  readonly page: number;
  readonly type: "previous" | "next" | "first" | "last";
}): ReactElement {
  const href = !disabled && getPageHref ? getPageHref(page) : undefined;
  return (
    <PaginationItemPart>
      {href ? (
        <a
          aria-label={label}
          data-type={type}
          data-uiify-button=""
          data-variant="ghost"
          href={href}
        >
          {labelText}
        </a>
      ) : (
        <span
          aria-disabled={disabled ? true : undefined}
          aria-label={label}
          data-disabled={disabled ? "" : undefined}
          data-type={type}
          data-uiify-button=""
          data-variant="ghost"
        >
          {labelText}
        </span>
      )}
    </PaginationItemPart>
  );
}
PaginationNavControl.displayName = "PaginationNavControl";

function formatPageNumber(page: number, locale?: string): string {
  return locale ? new Intl.NumberFormat(locale).format(page) : String(page);
}

function formatPageLabel(template: string, page: number, locale?: string): string {
  return formatLabel(template, { page: locale === undefined ? String(page) : page }, locale);
}

export function PaginationEllipsis<TAs extends ElementType = "span">(
  props: PaginationEllipsisProps<TAs>,
): ReactElement | null {
  const { as, render, ...consumerProps } = props as PaginationEllipsisProps<"span">;
  const element = useRenderElement({
    as,
    defaultTag: "span",
    props: {
      ...consumerProps,
      "aria-hidden": true,
      "data-type": "ellipsis",
      children: "…",
    },
    render,
    state: {},
  });

  return <PaginationItemPart>{element}</PaginationItemPart>;
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export const Pagination = {
  Ellipsis: PaginationEllipsis,
  Item: PaginationItemPart,
  Link: PaginationLink,
  List: PaginationList,
  Root: PaginationRoot,
};
