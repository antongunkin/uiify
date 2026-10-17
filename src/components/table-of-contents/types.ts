import type {
  AriaAttributes,
  CSSProperties,
  Ref,
  MouseEventHandler,
  ElementType,
  ReactNode,
} from "react";
import type { NativeButtonProps, RenderableProps } from "../../core/render.js";
import type { AnchorAlign, AnchorSide } from "../../core/anchor-position/types.js";

export type TableOfContentsLevel = 1 | 2 | 3 | 4 | 5 | 6;
export interface TableOfContentsRootOwnProps {
  readonly children?: ReactNode;
}
export type TableOfContentsRootProps<TAs extends ElementType = "nav"> = RenderableProps<
  TAs,
  TableOfContentsRootOwnProps,
  Record<string, never>,
  HTMLElement
>;
export interface TableOfContentsTriggerOwnProps {
  readonly children?: ReactNode;
  readonly target: string;
}
export type TableOfContentsTriggerProps<TAs extends ElementType = "button"> = NativeButtonProps<
  TAs,
  TableOfContentsTriggerOwnProps
>;
export interface TableOfContentsRailOwnProps {
  readonly children?: ReactNode;
}
export type TableOfContentsRailProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  TableOfContentsRailOwnProps,
  Record<string, never>,
  HTMLElement
>;
export interface TableOfContentsIndicatorOwnProps {
  readonly ref?: Ref<HTMLElement>;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
  /** Stable target ID matching a Link fragment. */
  readonly value: string;
  readonly level?: TableOfContentsLevel;
  readonly selected?: boolean;
}
export type TableOfContentsIndicatorProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  TableOfContentsIndicatorOwnProps,
  { selected: boolean },
  HTMLElement
>;
export interface TableOfContentsContentOwnProps {
  readonly children?: ReactNode;
  readonly id: string;
  readonly side?: AnchorSide;
  readonly align?: AnchorAlign;
}
export type TableOfContentsContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  TableOfContentsContentOwnProps,
  Record<string, never>,
  HTMLElement
>;
export interface TableOfContentsListOwnProps {
  readonly children?: ReactNode;
}
export type TableOfContentsListProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  TableOfContentsListOwnProps,
  Record<string, never>,
  HTMLElement
>;
export interface TableOfContentsLinkOwnProps {
  readonly style?: CSSProperties;
  readonly "aria-current"?: AriaAttributes["aria-current"];
  readonly children?: ReactNode;
  /** Native same-page anchor; external URLs are not tracked by scrollspy. */
  readonly href: string;
  readonly level?: TableOfContentsLevel;
  readonly selected?: boolean;
}
export type TableOfContentsLinkProps<TAs extends ElementType = "a"> = RenderableProps<
  TAs,
  TableOfContentsLinkOwnProps,
  { selected: boolean },
  HTMLAnchorElement
>;

export interface TableOfContentsTargetSnapshot {
  readonly value: string;
  readonly start: number;
  readonly visible: boolean;
}
export interface TableOfContentsScrollSnapshot {
  readonly targets: readonly TableOfContentsTargetSnapshot[];
  readonly viewportStart: number;
  readonly viewportEnd: number;
  readonly offset: number;
  readonly contentEnd: number | null;
}
export interface TableOfContentsObserverOptions {
  readonly root: HTMLElement;
  readonly scrollTarget?: string | undefined;
  readonly contentTarget?: string | undefined;
  readonly offset: number;
  readonly onValueChange: (value: string | null) => void;
}
export interface TableOfContentsObserver {
  readonly refresh: () => void;
  readonly destroy: () => void;
}

export interface TableOfContentsClientRootOwnProps extends TableOfContentsRootOwnProps {
  readonly ref?: Ref<HTMLElement>;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly onClick?: MouseEventHandler<HTMLElement>;
  readonly scrollSpy?: boolean;
  /** Scroll-container element ID; omitted tracks the owning window. */
  readonly scrollTarget?: string;
  /** Content element ID used for target scope and end-of-content selection. */
  readonly contentTarget?: string;
  readonly offset?: number;
  readonly value?: string | null;
  readonly defaultValue?: string | null;
  readonly onValueChange?: (value: string | null) => void;
  readonly open?: boolean;
  /** Applied after hydration; the native SSR surface starts closed. */
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly openOnHover?: boolean;
  readonly openDelay?: number;
  readonly closeDelay?: number;
}
export type TableOfContentsClientRootProps<TAs extends ElementType = "nav"> = RenderableProps<
  TAs,
  TableOfContentsClientRootOwnProps,
  { value: string | null; open: boolean },
  HTMLElement
>;
export interface TableOfContentsClientContextValue {
  readonly value: string | null;
  readonly open: boolean;
  readonly documentUrl: string | undefined;
}
export interface TableOfContentsInteractionOptions {
  readonly root: HTMLElement;
  readonly getOpen: () => boolean;
  readonly requestOpen: (open: boolean) => void;
  readonly controlled: boolean;
  readonly openOnHover: boolean;
  readonly openDelay: number;
  readonly closeDelay: number;
}
export interface TableOfContentsInteractions {
  readonly click: (event: MouseEvent) => void;
  readonly destroy: () => void;
}
export interface TableOfContentsPointerOptions {
  readonly root: HTMLElement;
}
