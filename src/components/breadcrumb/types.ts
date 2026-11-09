import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { RepeatedSlotProps, SlotProps } from "../../core/slot-props.js";

export interface BreadcrumbLabels {
  readonly root: string;
  readonly showCollapsed: string;
}

export interface BreadcrumbOwnProps {
  readonly labels?: Partial<BreadcrumbLabels>;
}

export type BreadcrumbProps<TAs extends ElementType = "nav"> = RenderableProps<
  TAs,
  BreadcrumbOwnProps,
  Record<string, never>,
  HTMLElement
>;

/** One logical breadcrumb entry. Used by `BreadcrumbList`'s `items` prop —
 * the data-driven alternative to `children` that `maxItems` collapsing
 * requires (see BreadcrumbList's own doc comment for why). */
export interface BreadcrumbItemData {
  readonly key: string;
  /** The current page: rendered as BreadcrumbPage, not a link. */
  readonly current?: boolean;
  readonly href?: string | undefined;
  readonly label: ReactNode;
}

export interface BreadcrumbListOwnProps {
  readonly children?: ReactNode;
  readonly labels?: Partial<BreadcrumbLabels>;
  /**
   * Data-driven items, required to use `maxItems`. Filtering children by
   * element type (`isValidElement` + a type check) can't see through a
   * Fragment-free `.map()` over route data into a custom wrapper component —
   * a real element only becomes visible to a parent's child introspection
   * once React actually renders it, which hasn't happened yet when
   * `BreadcrumbList` itself runs. An explicit array has no such blind spot.
   */
  readonly items?: readonly BreadcrumbItemData[];
  readonly itemsAfterCollapse?: number;
  readonly itemsBeforeCollapse?: number;
  readonly maxItems?: number;
  /** Content of the BreadcrumbSeparator rendered between `items`; none without it. */
  readonly separator?: ReactNode;
  readonly slotProps?: BreadcrumbListSlotProps;
}

export interface BreadcrumbListSlotProps {
  readonly item?: RepeatedSlotProps<SlotProps<"li">>;
  readonly link?: RepeatedSlotProps<SlotProps<"a">>;
  readonly page?: RepeatedSlotProps<SlotProps<"span">>;
  readonly separator?: SlotProps<"li">;
  readonly ellipsisItem?: SlotProps<"li">;
  readonly ellipsis?: SlotProps<"details">;
  readonly ellipsisTrigger?: SlotProps<"summary">;
  readonly ellipsisContent?: SlotProps<"ol">;
}

export type BreadcrumbListProps<TAs extends ElementType = "ol"> = RenderableProps<
  TAs,
  BreadcrumbListOwnProps,
  Record<string, never>,
  HTMLOListElement
>;

export type BreadcrumbItemProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLLIElement
>;

export interface BreadcrumbLinkOwnProps {
  readonly children?: ReactNode;
  readonly href?: string | undefined;
}

export type BreadcrumbLinkProps<TAs extends ElementType = "a"> = RenderableProps<
  TAs,
  BreadcrumbLinkOwnProps,
  Record<string, never>,
  HTMLAnchorElement
>;

/** The current page: a `span` with aria-current="page", not a link and not focusable. */
export type BreadcrumbPageProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLSpanElement
>;

export interface BreadcrumbSeparatorOwnProps {
  readonly children?: ReactNode;
}

/** A list item between two BreadcrumbItems, hidden from assistive technology. */
export type BreadcrumbSeparatorProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  BreadcrumbSeparatorOwnProps,
  Record<string, never>,
  HTMLLIElement
>;

/** A decorative "…" placed inside a BreadcrumbItem by the consumer. */
export type BreadcrumbEllipsisProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  { readonly children?: ReactNode },
  Record<string, never>,
  HTMLSpanElement
>;
