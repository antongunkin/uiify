import type { ElementType, ReactElement, ReactNode } from "react";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { DetailsContent, DetailsRoot, DetailsSummary } from "../../elements/details/index.js";
import { collapseBreadcrumbItems } from "./breadcrumb-collapse.js";
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbItemData,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "./types.js";

export function BreadcrumbRoot<TAs extends ElementType = "nav">(
  props: BreadcrumbRootProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    "aria-label": ariaLabel = "Breadcrumb",
    ...consumerProps
  } = props as BreadcrumbRootProps<"nav">;

  return useRenderElement({
    as,
    defaultTag: "nav",
    props: { ...consumerProps, "aria-label": ariaLabel },
    render,
    state: {},
  });
}

function renderDataItem(item: BreadcrumbItemData, separator: ReactNode): ReactElement {
  return (
    <BreadcrumbItem key={item.key}>
      <BreadcrumbLink
        {...(item.current !== undefined ? { current: item.current } : {})}
        {...(item.href !== undefined ? { href: item.href } : {})}
      >
        {item.label}
      </BreadcrumbLink>
      {separator}
    </BreadcrumbItem>
  );
}

export function BreadcrumbList<TAs extends ElementType = "ol">(
  props: BreadcrumbListProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    items,
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    maxItems,
    separator,
    ...consumerProps
  } = props as BreadcrumbListProps<"ol">;

  if (maxItems !== undefined && items === undefined) {
    throw new Error(
      "Breadcrumb.List: maxItems requires the data-driven `items` prop — collapsing can't " +
        "safely introspect `children` (a .map() through a wrapper component hides real " +
        "elements from child traversal until React actually renders them).",
    );
  }

  let content: ReactNode = children;
  if (items !== undefined) {
    const collapsed =
      maxItems === undefined
        ? undefined
        : collapseBreadcrumbItems(items, maxItems, itemsBeforeCollapse, itemsAfterCollapse);

    content = collapsed
      ? [
          ...collapsed.before.map((item) => renderDataItem(item, separator)),
          <BreadcrumbEllipsis
            hiddenItems={collapsed.hidden}
            key="ellipsis"
            separator={separator}
          />,
          ...collapsed.after.map((item, index) =>
            renderDataItem(item, index === collapsed.after.length - 1 ? null : separator),
          ),
        ]
      : items.map((item, index) =>
          renderDataItem(item, index === items.length - 1 ? null : separator),
        );
  }

  return useRenderElement({
    as,
    defaultTag: "ol",
    props: { ...consumerProps, children: content },
    render,
    state: {},
  });
}
BreadcrumbList.displayName = "BreadcrumbList";

export function BreadcrumbItem<TAs extends ElementType = "li">(
  props: BreadcrumbItemProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as BreadcrumbItemProps<"li">;

  return useRenderElement({
    as,
    defaultTag: "li",
    props: { ...consumerProps, children },
    render,
    state: {},
  });
}

export function BreadcrumbLink<TAs extends ElementType = "a">(
  props: BreadcrumbLinkProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children,
    current = false,
    href,
    ...consumerProps
  } = props as BreadcrumbLinkProps<"a">;

  return useRenderElement({
    as,
    defaultTag: "a",
    props: {
      ...consumerProps,
      "aria-current": current ? "page" : undefined,
      "data-current": current ? "" : undefined,
      href,
      children,
    },
    render,
    state: { current },
  });
}

export function BreadcrumbSeparator<TAs extends ElementType = "span">(
  props: BreadcrumbSeparatorProps<TAs>,
): ReactElement | null {
  const {
    as,
    render,
    children = "/",
    ...consumerProps
  } = props as BreadcrumbSeparatorProps<"span">;

  return useRenderElement({
    as,
    defaultTag: "span",
    props: { ...consumerProps, "aria-hidden": true, children },
    render,
    state: {},
  });
}

/**
 * Built on `@gunkin/uiify/elements/details`: `Details.Summary`/`Details.Content` are used without a
 * `part` (this trigger and panel carry no `data-part`, unlike Accordion/Collapsible's), and
 * `Details.Content` renders as `<ol>` via `as` instead of the default `<div>`.
 */
function BreadcrumbEllipsis({ hiddenItems, separator }: BreadcrumbEllipsisProps): ReactElement {
  return (
    <BreadcrumbItem>
      <DetailsRoot data-uiify-breadcrumb-ellipsis="">
        <DetailsSummary aria-label="Show collapsed breadcrumbs">…</DetailsSummary>
        <DetailsContent as="ol">
          {hiddenItems.map((item) => (
            <BreadcrumbLink
              key={item.key}
              {...(item.current !== undefined ? { current: item.current } : {})}
              {...(item.href !== undefined ? { href: item.href } : {})}
            >
              {item.label}
            </BreadcrumbLink>
          ))}
        </DetailsContent>
      </DetailsRoot>
      {separator}
    </BreadcrumbItem>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export function BreadcrumbEllipsisPart(): ReactElement {
  return (
    <BreadcrumbItem>
      <span aria-hidden="true">…</span>
    </BreadcrumbItem>
  );
}
BreadcrumbEllipsisPart.displayName = "BreadcrumbEllipsisPart";

export const Breadcrumb = {
  Ellipsis: BreadcrumbEllipsisPart,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  List: BreadcrumbList,
  Root: BreadcrumbRoot,
  Separator: BreadcrumbSeparator,
};
