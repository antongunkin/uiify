import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface BreadcrumbRootOwnProps {
  readonly "aria-label"?: string;
}

export type BreadcrumbRootProps<TAs extends ElementType = "nav"> = RenderableProps<
  TAs,
  BreadcrumbRootOwnProps,
  Record<string, never>,
  HTMLElement
>;

/** One logical breadcrumb entry. Used by `BreadcrumbList`'s `items` prop —
 * the data-driven alternative to `children` that `maxItems` collapsing
 * requires (see BreadcrumbList's own doc comment for why). */
export interface BreadcrumbItemData {
  readonly key: string;
  readonly current?: boolean;
  readonly href?: string;
  readonly label: ReactNode;
}

export interface BreadcrumbListOwnProps {
  readonly children?: ReactNode;
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
  readonly separator?: ReactNode;
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
  readonly current?: boolean;
  readonly href?: string;
}

export type BreadcrumbLinkProps<TAs extends ElementType = "a"> = RenderableProps<
  TAs,
  BreadcrumbLinkOwnProps,
  { current: boolean },
  HTMLAnchorElement
>;

export interface BreadcrumbSeparatorOwnProps {
  readonly children?: ReactNode;
}

export type BreadcrumbSeparatorProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  BreadcrumbSeparatorOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface BreadcrumbEllipsisProps {
  readonly hiddenItems: readonly BreadcrumbItemData[];
  readonly separator?: ReactNode;
}
