import type {
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from "react";
import type { AnchorAlign, AnchorSide } from "@gunkin/uiify/core/anchor-position";
import type { PopoverChangeHandler } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface MenuPartOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type MenuGroupProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  MenuPartOwnProps,
  Record<string, never>,
  HTMLElement
>;

export type MenuLabelProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  MenuPartOwnProps,
  Record<string, never>,
  HTMLElement
>;

export type MenuSeparatorProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  Omit<MenuPartOwnProps, "children">,
  Record<string, never>,
  HTMLElement
>;

/**
 * Cancelable "an item was chosen" event, shared by DropdownMenu and
 * ContextMenu items. Canonical home for what used to be declared in
 * `dropdown-menu/types.ts` and imported across a component-directory boundary
 * by `context-menu/types.ts`.
 */
export interface MenuSelectEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}

export interface UseMenuSurfaceOptions {
  readonly align?: AnchorAlign;
  readonly defaultOpen?: boolean;
  /** `"auto"` for click-dismissable surfaces, `"manual"` when the compound drives dismissal. */
  readonly mode: "auto" | "manual";
  readonly onOpenChange?: PopoverChangeHandler;
  readonly open?: boolean;
  readonly side?: AnchorSide;
}

export interface UseMenuSurfaceReturn {
  readonly anchorProps: HTMLAttributes<HTMLElement>;
  readonly close: () => void;
  readonly contentRef: RefObject<HTMLDivElement | null>;
  /** Return focus to the element that opened the surface. */
  readonly focusTrigger: () => void;
  readonly open: boolean;
  readonly openPopover: () => void;
  /** Open (if closed) and move focus into the list on the next microtask. */
  readonly openToItem: (last?: boolean) => void;
  readonly popupProps: HTMLAttributes<HTMLElement>;
  readonly popupRef: (element: HTMLElement | null) => void;
  readonly positionerProps: HTMLAttributes<HTMLElement>;
  readonly setTriggerElement: (element: HTMLElement | null) => void;
  readonly triggerProps: ButtonHTMLAttributes<HTMLButtonElement>;
  readonly triggerRef: RefObject<HTMLElement | null>;
}
