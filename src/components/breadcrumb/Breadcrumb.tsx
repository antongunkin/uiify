import type { ElementType, ReactElement, ReactNode } from "react";
import { cn, useRenderElement } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import {
  NativeDetailsContent,
  NativeDetailsRoot,
  NativeDetailsSummary,
} from "../../elements/native-details/index.js";
import { collapseBreadcrumbItems } from "./breadcrumb-collapse.js";
import type {
  BreadcrumbLabels,
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbItemData,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
  BreadcrumbListSlotProps,
} from "./types.js";

const DEFAULT_BREADCRUMB_LABELS: BreadcrumbLabels = {
  root: "Breadcrumb",
  showCollapsed: "Show collapsed breadcrumbs",
};

// API informed by shadcn/ui public documentation (names and props only).
export function Breadcrumb<TAs extends ElementType = "nav">(
  props: BreadcrumbProps<TAs>,
): ReactElement | null {
  const { as, render, labels, ...consumerProps } = props as BreadcrumbProps<"nav">;
  const resolvedLabels = { ...DEFAULT_BREADCRUMB_LABELS, ...labels };

  return useRenderElement({
    as,
    defaultTag: "nav",
    props: {
      "aria-label": resolvedLabels.root,
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
    },
    render,
    state: {},
  });
}

/** The current item is a BreadcrumbPage; the others are links. */
function renderEntry(
  item: BreadcrumbItemData,
  slotProps: BreadcrumbListSlotProps | undefined,
): ReactElement {
  return item.current ? (
    <BreadcrumbPage {...resolveRepeatedSlotProps(slotProps?.page, item.key)}>
      {item.label}
    </BreadcrumbPage>
  ) : (
    <BreadcrumbLink
      {...(item.href !== undefined ? { href: item.href } : {})}
      {...resolveRepeatedSlotProps(slotProps?.link, item.key)}
    >
      {item.label}
    </BreadcrumbLink>
  );
}

function renderDataItem(
  item: BreadcrumbItemData,
  slotProps: BreadcrumbListSlotProps | undefined,
): ReactElement {
  return (
    <BreadcrumbItem {...resolveRepeatedSlotProps(slotProps?.item, item.key)} key={item.key}>
      {renderEntry(item, slotProps)}
    </BreadcrumbItem>
  );
}

/** Items with a BreadcrumbSeparator `li` between each two, as shadcn/ui lays them out. */
function withSeparators(
  entries: readonly ReactElement[],
  separator: ReactNode,
  slotProps: BreadcrumbListSlotProps | undefined,
): ReactNode[] {
  if (separator === undefined || separator === null) return [...entries];
  return entries.flatMap((entry, index) =>
    index === 0
      ? [entry]
      : [
          <BreadcrumbSeparator {...slotProps?.separator} key={`separator-${entry.key ?? index}`}>
            {separator}
          </BreadcrumbSeparator>,
          entry,
        ],
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
    labels,
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    maxItems,
    separator,
    slotProps,
    ...consumerProps
  } = props as BreadcrumbListProps<"ol">;
  const resolvedLabels = { ...DEFAULT_BREADCRUMB_LABELS, ...labels };

  if (maxItems !== undefined && items === undefined) {
    throw new Error(
      "BreadcrumbList: maxItems requires the data-driven `items` prop — collapsing can't " +
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
    const entries = collapsed
      ? [
          ...collapsed.before.map((item) => renderDataItem(item, slotProps)),
          <BreadcrumbCollapse
            hiddenItems={collapsed.hidden}
            key="ellipsis"
            labels={resolvedLabels}
            {...(slotProps ? { slotProps } : {})}
          />,
          ...collapsed.after.map((item) => renderDataItem(item, slotProps)),
        ]
      : items.map((item) => renderDataItem(item, slotProps));
    content = withSeparators(entries, separator, slotProps);
  }

  return useRenderElement({
    as,
    defaultTag: "ol",
    props: {
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb-list",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children: content,
    },
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
    props: {
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb-item",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children,
    },
    render,
    state: {},
  });
}

export function BreadcrumbLink<TAs extends ElementType = "a">(
  props: BreadcrumbLinkProps<TAs>,
): ReactElement | null {
  const { as, render, children, href, ...consumerProps } = props as BreadcrumbLinkProps<"a">;

  return useRenderElement({
    as,
    defaultTag: "a",
    props: {
      href,
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb-link",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children,
    },
    render,
    state: {},
  });
}

export function BreadcrumbPage<TAs extends ElementType = "span">(
  props: BreadcrumbPageProps<TAs>,
): ReactElement | null {
  const { as, render, children, ...consumerProps } = props as BreadcrumbPageProps<"span">;

  return useRenderElement({
    as,
    defaultTag: "span",
    props: {
      "aria-current": "page",
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb-page",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children,
    },
    render,
    state: {},
  });
}

export function BreadcrumbSeparator<TAs extends ElementType = "li">(
  props: BreadcrumbSeparatorProps<TAs>,
): ReactElement | null {
  const { as, render, children = "/", ...consumerProps } = props as BreadcrumbSeparatorProps<"li">;

  return useRenderElement({
    as,
    defaultTag: "li",
    props: {
      // shadcn/ui writes role="presentation"; "none" is the same role in the form html-validate asks for.
      role: "none",
      "aria-hidden": true,
      ...consumerProps,
      className: cn(
        "uiify-breadcrumb-separator",
        "className" in consumerProps ? consumerProps.className : undefined,
      ),
      children,
    },
    render,
    state: {},
  });
}

interface BreadcrumbCollapseProps {
  readonly hiddenItems: readonly BreadcrumbItemData[];
  readonly labels: BreadcrumbLabels;
  readonly slotProps?: BreadcrumbListSlotProps;
}

/**
 * The collapsed middle of `items`: built on the native Details Element so the hidden links work
 * without JavaScript. Each hidden link sits in its own list item.
 */
function BreadcrumbCollapse({
  hiddenItems,
  labels,
  slotProps,
}: BreadcrumbCollapseProps): ReactElement {
  return (
    <BreadcrumbItem {...slotProps?.ellipsisItem}>
      <NativeDetailsRoot
        {...slotProps?.ellipsis}
        className={cn("uiify-breadcrumb-ellipsis", slotProps?.ellipsis?.className)}
      >
        <NativeDetailsSummary aria-label={labels.showCollapsed} {...slotProps?.ellipsisTrigger}>
          …
        </NativeDetailsSummary>
        <NativeDetailsContent
          as="ol"
          {...slotProps?.ellipsisContent}
          className={cn("uiify-breadcrumb-ellipsis-content", slotProps?.ellipsisContent?.className)}
        >
          {hiddenItems.map((item) => renderDataItem(item, slotProps))}
        </NativeDetailsContent>
      </NativeDetailsRoot>
    </BreadcrumbItem>
  );
}
BreadcrumbCollapse.displayName = "BreadcrumbCollapse";

/** A decorative "…" (aria-hidden); place it inside a BreadcrumbItem, as in shadcn/ui. */
export function BreadcrumbEllipsis<TAs extends ElementType = "span">(
  props: BreadcrumbEllipsisProps<TAs>,
): ReactElement | null {
  const { as, render, children = "…", ...consumerProps } = props as BreadcrumbEllipsisProps<"span">;

  return useRenderElement({
    as,
    defaultTag: "span",
    props: { "aria-hidden": true, ...consumerProps, children },
    render,
    state: {},
  });
}
