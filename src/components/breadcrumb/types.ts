import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes, RepeatedSlotProps } from "../../core/slot-props.js";

export interface BreadcrumbLabels {
  readonly root: string;
  readonly showCollapsed: string;
}

export interface BreadcrumbRootOwnProps {
  readonly "aria-label"?: string;
  readonly labels?: Partial<BreadcrumbLabels>;
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
  readonly separator?: ReactNode;
  readonly slotProps?: BreadcrumbListSlotProps;
}

type BreadcrumbPartProps<TTag extends ElementType> = Omit<
  ComponentPropsWithRef<TTag>,
  "children" | "dangerouslySetInnerHTML" | "key"
>;

type BreadcrumbDirectSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = BreadcrumbPartProps<TTag> &
  ConsumerDataAttributes & {
    readonly "data-part"?: never;
  } & TOwned;

type BreadcrumbRepeatedSlotProps<
  TTag extends ElementType,
  TOwned extends object = object,
> = RepeatedSlotProps<BreadcrumbPartProps<TTag>, { readonly "data-part"?: never } & TOwned>;

type BreadcrumbLinkSlotProps = BreadcrumbRepeatedSlotProps<
  "a",
  {
    readonly "aria-current"?: never;
    readonly current?: never;
    readonly "data-current"?: never;
    readonly href?: never;
  }
>;

export interface BreadcrumbListSlotProps {
  /** Generated item wrappers and links use `byItemValue[item.key]`. */
  readonly item?: BreadcrumbRepeatedSlotProps<"li">;
  readonly link?: BreadcrumbLinkSlotProps;
  readonly ellipsisItem?: BreadcrumbDirectSlotProps<"li">;
  readonly ellipsis?: BreadcrumbDirectSlotProps<
    "details",
    { readonly "data-uiify-breadcrumb"?: never; readonly "data-uiify-details"?: never }
  >;
  readonly ellipsisTrigger?: BreadcrumbDirectSlotProps<
    "summary",
    { readonly "aria-label"?: never }
  >;
  readonly ellipsisContent?: BreadcrumbDirectSlotProps<
    "ol",
    { readonly "data-uiify-details"?: never }
  >;
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
  readonly labels: BreadcrumbLabels;
  readonly separator?: ReactNode;
  readonly slotProps?: BreadcrumbListSlotProps;
}

export interface BreadcrumbEllipsisPartProps {
  readonly slotProps?: {
    readonly item?: BreadcrumbDirectSlotProps<"li">;
    readonly ellipsis?: BreadcrumbDirectSlotProps<"span">;
  };
}
