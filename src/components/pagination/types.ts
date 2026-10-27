import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export type PaginationItemType = "page" | "ellipsis" | "previous" | "next" | "first" | "last";

export interface PaginationPageItem {
  readonly disabled: boolean;
  readonly page: number;
  readonly selected: boolean;
  readonly type: "page";
}

export interface PaginationControlItem {
  readonly disabled: boolean;
  readonly page?: number;
  readonly selected: false;
  readonly type: Exclude<PaginationItemType, "page">;
}

export type PaginationItem = PaginationPageItem | PaginationControlItem;

export interface PaginationLabels {
  readonly root: string;
  readonly page: string;
  readonly previous: string;
  readonly next: string;
  readonly first: string;
  readonly last: string;
  readonly previousText: string;
  readonly nextText: string;
  readonly firstText: string;
  readonly lastText: string;
}

export interface UsePaginationParams {
  readonly boundaryCount?: number;
  readonly count: number;
  readonly defaultPage?: number;
  readonly disabled?: boolean;
  readonly onPageChange?: (page: number) => void;
  readonly page?: number;
  readonly showFirstLast?: boolean;
  readonly siblingCount?: number;
}

export interface UsePaginationReturn {
  readonly items: readonly PaginationItem[];
  readonly page: number;
  readonly setPage: (page: number) => void;
}

export interface PaginationContextValue {
  readonly count: number;
  readonly items: readonly PaginationItem[];
  readonly labels: PaginationLabels;
  readonly locale?: string;
  readonly page: number;
  readonly setPage: (page: number) => void;
  readonly slotProps?: PaginationRootSlotProps;
}

type PaginationRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = RepeatedSlotProps<
  Omit<ComponentPropsWithRef<TTag>, "children" | "dangerouslySetInnerHTML">,
  TOwned
>;

export interface PaginationRootSlotProps {
  readonly list?: Omit<ComponentPropsWithRef<"ol">, "children" | "dangerouslySetInnerHTML"> &
    ConsumerDataAttributes;
  readonly item?: PaginationRepeatedSlotProps<"li">;
  readonly link?: PaginationRepeatedSlotProps<
    "button",
    {
      readonly "aria-current"?: never;
      readonly "aria-label"?: never;
      readonly disabled?: never;
      readonly "data-selected"?: never;
      readonly "data-size"?: never;
      readonly "data-type"?: never;
      readonly "data-uiify-button"?: never;
      readonly "data-variant"?: never;
      readonly type?: never;
    }
  >;
  readonly control?: PaginationRepeatedSlotProps<
    "button",
    {
      readonly "aria-label"?: never;
      readonly disabled?: never;
      readonly "data-type"?: never;
      readonly "data-uiify-button"?: never;
      readonly "data-variant"?: never;
      readonly type?: never;
    }
  >;
  readonly ellipsis?: PaginationRepeatedSlotProps<
    "span",
    { readonly "aria-hidden"?: never; readonly "data-type"?: never }
  >;
}

export interface PaginationRootOwnProps extends UsePaginationParams {
  readonly "aria-label"?: string;
  readonly children?: ReactNode;
  readonly getPageHref?: (page: number) => string;
  readonly labels?: Partial<PaginationLabels>;
  readonly locale?: string;
  readonly slotProps?: PaginationRootSlotProps;
}

export type PaginationRootProps<TAs extends ElementType = "nav"> = RenderableProps<
  TAs,
  PaginationRootOwnProps,
  { page: number },
  HTMLElement
>;

export interface PaginationListOwnProps {
  readonly children?: ReactNode;
}

export type PaginationListProps<TAs extends ElementType = "ol"> = RenderableProps<
  TAs,
  PaginationListOwnProps,
  Record<string, never>,
  HTMLOListElement
>;

export interface PaginationItemOwnProps {
  readonly children?: ReactNode;
}

export type PaginationItemProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  PaginationItemOwnProps,
  Record<string, never>,
  HTMLLIElement
>;

export interface PaginationLinkOwnProps {
  readonly disabled?: boolean;
  readonly getPageHref?: (page: number) => string;
  readonly locale?: string;
  readonly pageLabelTemplate?: string;
  readonly page: number;
  readonly selected?: boolean;
}

export type PaginationLinkProps<TAs extends ElementType = "a"> = RenderableProps<
  TAs,
  PaginationLinkOwnProps,
  { selected: boolean },
  HTMLElement
>;

export interface PaginationEllipsisOwnProps {
  readonly children?: ReactNode;
}

export type PaginationEllipsisProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  PaginationEllipsisOwnProps,
  Record<string, never>,
  HTMLElement
>;
