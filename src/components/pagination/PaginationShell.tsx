import type { ElementType, ReactElement } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { buildPaginationItems } from "./pagination-engine.js";

import type {
  PaginationItem,
  PaginationRootProps,
  PaginationListProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationEllipsisProps,
} from "./types.js";

export { buildPaginationItems } from "./pagination-engine.js";

export function PaginationRoot<TAs extends ElementType = "nav">(
  props: PaginationRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    "aria-label": ariaLabel = "Pagination",
    boundaryCount = 1,
    count,
    disabled = false,
    getPageHref,
    page = 1,
    showFirstLast = false,
    siblingCount = 1,
    children,
    defaultPage: _defaultPage,
    onChange: _onChange,
    ...consumerProps
  } = props as PaginationRootProps<"nav">;

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
      "aria-label": ariaLabel,
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
  page,
}: {
  readonly getPageHref?: (page: number) => string;
  readonly item: PaginationItem;
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
          label="Previous page"
          page={page - 1}
          type="previous"
          {...hrefProps}
        />
      );
    case "next":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label="Next page"
          page={page + 1}
          type="next"
          {...hrefProps}
        />
      );
    case "first":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label="First page"
          page={1}
          type="first"
          {...hrefProps}
        />
      );
    case "last":
      return (
        <PaginationNavControl
          disabled={item.disabled}
          label="Last page"
          page={item.page ?? page}
          type="last"
          {...hrefProps}
        />
      );
    default:
      return (
        <PaginationLink
          disabled={item.disabled}
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
      "aria-label": `Page ${page}`,
      "aria-disabled": disabled ? true : undefined,
      "data-selected": selected ? "" : undefined,
      "data-type": "page",
      href,
      children: page,
    },
    render,
    state: { selected },
  });
}

function PaginationNavControl({
  disabled,
  getPageHref,
  label,
  page,
  type,
}: {
  readonly disabled: boolean;
  readonly getPageHref?: (page: number) => string;
  readonly label: string;
  readonly page: number;
  readonly type: "previous" | "next" | "first" | "last";
}): ReactElement {
  const href = !disabled && getPageHref ? getPageHref(page) : undefined;
  const labelText =
    type === "previous"
      ? "Previous"
      : type === "next"
        ? "Next"
        : type === "first"
          ? "First"
          : "Last";

  return (
    <PaginationItemPart>
      {href ? (
        <a aria-label={label} data-type={type} href={href}>
          {labelText}
        </a>
      ) : (
        <span aria-disabled={disabled ? true : undefined} aria-label={label} data-type={type}>
          {labelText}
        </span>
      )}
    </PaginationItemPart>
  );
}
PaginationNavControl.displayName = "PaginationNavControl";

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
