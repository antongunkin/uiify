import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

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

export interface UsePaginationParams {
  readonly boundaryCount?: number;
  readonly count: number;
  readonly defaultPage?: number;
  readonly disabled?: boolean;
  readonly onChange?: (page: number) => void;
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
  readonly page: number;
  readonly setPage: (page: number) => void;
}

export interface PaginationRootOwnProps extends UsePaginationParams {
  readonly "aria-label"?: string;
  readonly children?: ReactNode;
  readonly getPageHref?: (page: number) => string;
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
