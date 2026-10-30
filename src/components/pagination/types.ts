import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { RepeatedSlotProps, SlotProps } from "../../core/slot-props.js";

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
  readonly disabled?: boolean | undefined;
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

export interface PaginationRootSlotProps {
  readonly list?: SlotProps<"ol">;
  readonly item?: RepeatedSlotProps<SlotProps<"li">>;
  readonly link?: RepeatedSlotProps<SlotProps<"button">>;
  readonly control?: RepeatedSlotProps<SlotProps<"button">>;
  readonly ellipsis?: RepeatedSlotProps<SlotProps<"span">>;
}

export interface PaginationRootOwnProps extends UsePaginationParams {
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
  readonly disabled?: boolean | undefined;
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
