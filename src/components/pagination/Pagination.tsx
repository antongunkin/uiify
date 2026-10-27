"use client";

import { useMemo } from "react";
import type {
  ComponentPropsWithRef,
  ElementType,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from "react";
import { createPartContext } from "@gunkin/uiify/core";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { useRenderElement } from "@gunkin/uiify/core/render";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
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
    slotProps,
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
      labels: { ...DEFAULT_PAGINATION_LABELS, ...labels },
      ...(locale !== undefined ? { locale } : {}),
      page: currentPage,
      setPage,
      ...(slotProps ? { slotProps } : {}),
    }),
    [count, currentPage, items, labels, locale, setPage, slotProps],
  );

  const element = useRenderElement({
    as,
    defaultTag: "nav",
    props: {
      ...consumerProps,
      "aria-label": ariaLabel ?? mergedLabels.root,
      children: children ?? (
        <ol {...slotProps?.list}>
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
          itemKey={getPaginationItemKey(item, index)}
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
  itemKey,
  labels,
  locale,
}: {
  readonly item: PaginationItem;
  readonly itemKey: string;
  readonly labels: PaginationContextValue["labels"];
  readonly locale?: string;
}): ReactElement {
  const { slotProps } = usePaginationContext("Item");
  const itemProps = resolveRepeatedSlotProps(slotProps?.item, itemKey);

  let content: ReactElement;
  switch (item.type) {
    case "ellipsis": {
      const ellipsisProps = resolveRepeatedSlotProps(slotProps?.ellipsis, itemKey, [
        "aria-hidden",
        "data-type",
      ]);
      content = (
        <span {...ellipsisProps} aria-hidden="true" data-type="ellipsis">
          …
        </span>
      );
      break;
    }
    case "previous":
      content = (
        <PaginationPrevious
          {...resolveRepeatedSlotProps(slotProps?.control, itemKey, [
            "aria-label",
            "data-type",
            "data-uiify-button",
            "data-variant",
            "disabled",
            "type",
          ])}
          disabled={item.disabled}
          labels={labels}
        />
      );
      break;
    case "next":
      content = (
        <PaginationNext
          {...resolveRepeatedSlotProps(slotProps?.control, itemKey, [
            "aria-label",
            "data-type",
            "data-uiify-button",
            "data-variant",
            "disabled",
            "type",
          ])}
          disabled={item.disabled}
          labels={labels}
        />
      );
      break;
    case "first":
      content = (
        <PaginationFirst
          {...resolveRepeatedSlotProps(slotProps?.control, itemKey, [
            "aria-label",
            "data-type",
            "data-uiify-button",
            "data-variant",
            "disabled",
            "type",
          ])}
          disabled={item.disabled}
          labels={labels}
        />
      );
      break;
    case "last":
      content = (
        <PaginationLast
          {...resolveRepeatedSlotProps(slotProps?.control, itemKey, [
            "aria-label",
            "data-type",
            "data-uiify-button",
            "data-variant",
            "disabled",
            "type",
          ])}
          disabled={item.disabled}
          labels={labels}
        />
      );
      break;
    default: {
      const linkProps = resolveRepeatedSlotProps(slotProps?.link, itemKey, [
        "aria-current",
        "aria-label",
        "data-selected",
        "data-size",
        "data-type",
        "data-uiify-button",
        "data-variant",
        "disabled",
        "href",
        "type",
      ]);
      content = (
        <PaginationLink
          {...linkProps}
          disabled={item.disabled}
          {...(locale !== undefined ? { locale } : {})}
          pageLabelTemplate={labels.page}
          page={item.page ?? 1}
          selected={item.selected}
        />
      );
      break;
    }
  }
  return <PaginationItemPart {...itemProps}>{content}</PaginationItemPart>;
}
PaginationItemRenderer.displayName = "PaginationItemRenderer";

function getPaginationItemKey(item: PaginationItem, index: number): string {
  if (item.type === "page") return `page:${item.page}`;
  if (item.type === "ellipsis") return `ellipsis:${index}`;
  return item.type;
}

export function PaginationList(): ReactElement | null {
  const { items, labels, locale } = usePaginationContext("List");

  return (
    <PaginationListElement>
      {items.map((item, index) => (
        <PaginationItemRenderer
          item={item}
          itemKey={getPaginationItemKey(item, index)}
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

type PaginationControlNativeProps = Omit<
  ComponentPropsWithRef<"button">,
  | "aria-label"
  | "children"
  | "data-type"
  | "data-uiify-button"
  | "data-variant"
  | "disabled"
  | "type"
>;

interface PaginationControlButtonProps extends PaginationControlNativeProps {
  readonly disabled: boolean;
  readonly label: string;
  readonly labelText: string;
  readonly onAction: () => void;
  readonly type: "previous" | "next" | "first" | "last";
}

function PaginationControlButton({
  disabled,
  label,
  labelText,
  onAction,
  type,
  ...consumerProps
}: PaginationControlButtonProps): ReactElement {
  const onClick = consumerProps.onClick as MouseEventHandler<HTMLButtonElement> | undefined;
  return (
    <button
      {...consumerProps}
      aria-label={label}
      data-type={type}
      data-uiify-button=""
      data-variant="ghost"
      disabled={disabled}
      onClick={composeEventHandlers(onClick, onAction)}
      type="button"
    >
      {labelText}
    </button>
  );
}
PaginationControlButton.displayName = "PaginationControlButton";

function PaginationPrevious({
  disabled,
  labels,
  ...consumerProps
}: PaginationControlNativeProps & {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { page, setPage } = usePaginationContext("Previous");
  return (
    <PaginationControlButton
      {...consumerProps}
      disabled={disabled}
      label={labels.previous}
      labelText={labels.previousText}
      onAction={() => setPage(page - 1)}
      type="previous"
    />
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
  disabled,
  labels,
  ...consumerProps
}: PaginationControlNativeProps & {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { page, setPage } = usePaginationContext("Next");
  return (
    <PaginationControlButton
      {...consumerProps}
      disabled={disabled}
      label={labels.next}
      labelText={labels.nextText}
      onAction={() => setPage(page + 1)}
      type="next"
    />
  );
}
PaginationNext.displayName = "PaginationNext";

function PaginationFirst({
  disabled,
  labels,
  ...consumerProps
}: PaginationControlNativeProps & {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { setPage } = usePaginationContext("First");
  return (
    <PaginationControlButton
      {...consumerProps}
      disabled={disabled}
      label={labels.first}
      labelText={labels.firstText}
      onAction={() => setPage(1)}
      type="first"
    />
  );
}
PaginationFirst.displayName = "PaginationFirst";

function PaginationLast({
  disabled,
  labels,
  ...consumerProps
}: PaginationControlNativeProps & {
  readonly disabled: boolean;
  readonly labels: PaginationContextValue["labels"];
}): ReactElement {
  const { count, setPage } = usePaginationContext("Last");
  return (
    <PaginationControlButton
      {...consumerProps}
      disabled={disabled}
      label={labels.last}
      labelText={labels.lastText}
      onAction={() => setPage(count)}
      type="last"
    />
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
