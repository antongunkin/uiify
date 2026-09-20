import type { ElementType, ReactNode, RefObject } from "react";
import type { AnchorAlign, AnchorSide } from "@gunkin/uiify/core/anchor-position";
import type { Direction } from "@gunkin/uiify/core/direction";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type {
  MenuGroupProps,
  MenuLabelProps,
  MenuSelectEvent,
  MenuSeparatorProps,
  UseMenuSurfaceReturn,
} from "../internal/menu/types.js";

export type { MenuSelectEvent };

export type DropdownMenuCheckedState = boolean | "indeterminate";
export type DropdownMenuOpenChangeReason =
  | "trigger-press"
  | "item-select"
  | "escape"
  | "focus-out"
  | "outside-press"
  | "programmatic";

export interface DropdownMenuOpenChangeDetails {
  readonly event: Event | null;
  readonly reason: DropdownMenuOpenChangeReason;
}

export interface DropdownMenuContextValue extends UseMenuSurfaceReturn {
  readonly cancelHoverClose: () => void;
  readonly dir: Direction;
  readonly disabled: boolean;
  readonly hoverEnabledRef: RefObject<boolean>;
  readonly loop: boolean;
  readonly scheduleHoverClose: () => void;
}

export interface DropdownMenuBarOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly dir?: Direction;
  readonly loop?: boolean;
}
export type DropdownMenuBarProps = DropdownMenuBarOwnProps;

export interface DropdownMenuRootOwnProps {
  readonly children?: ReactNode;
  readonly defaultOpen?: boolean;
  readonly dir?: Direction;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly loop?: boolean;
  readonly onOpenChange?: (open: boolean, details: DropdownMenuOpenChangeDetails) => void;
  readonly open?: boolean;
}

export type DropdownMenuRootProps = DropdownMenuRootOwnProps;
export type DropdownMenuRootShellOwnProps = DropdownMenuRootOwnProps;
export type DropdownMenuRootControlledOwnProps = Pick<
  DropdownMenuRootOwnProps,
  "onOpenChange" | "open"
>;
export type DropdownMenuRootShellProps = DropdownMenuRootOwnProps;

export interface DropdownMenuTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly openOnHover?: boolean;
}
export type DropdownMenuTriggerProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  DropdownMenuTriggerOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface DropdownMenuContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly side?: AnchorSide;
}
export type DropdownMenuContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuContentOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface DropdownMenuItemOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly closeOnSelect?: boolean;
  readonly disabled?: boolean;
  readonly onSelect?: (event: MenuSelectEvent) => void;
  readonly textValue?: string;
}
export type DropdownMenuItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuItemOwnProps,
  { disabled: boolean },
  HTMLElement
>;

export interface DropdownMenuCheckboxItemOwnProps extends DropdownMenuItemOwnProps {
  readonly checked?: DropdownMenuCheckedState;
  readonly defaultChecked?: DropdownMenuCheckedState;
  readonly onCheckedChange?: (checked: boolean) => void;
}
export type DropdownMenuCheckboxItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuCheckboxItemOwnProps,
  { checked: DropdownMenuCheckedState; disabled: boolean },
  HTMLElement
>;

export interface DropdownMenuRadioGroupOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly value?: string;
}
export type DropdownMenuRadioGroupProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuRadioGroupOwnProps,
  { value: string | undefined },
  HTMLElement
>;

export interface DropdownMenuRadioItemOwnProps extends DropdownMenuItemOwnProps {
  readonly value: string;
}
export type DropdownMenuRadioItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuRadioItemOwnProps,
  { checked: boolean; disabled: boolean },
  HTMLElement
>;

export interface DropdownMenuSubOwnProps {
  readonly children?: ReactNode;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean, details: DropdownMenuOpenChangeDetails) => void;
  readonly open?: boolean;
}
export type DropdownMenuSubProps = DropdownMenuSubOwnProps;
export interface DropdownMenuSubTriggerOwnProps extends DropdownMenuItemOwnProps {}
export type DropdownMenuSubTriggerProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  DropdownMenuSubTriggerOwnProps,
  { disabled: boolean; open: boolean },
  HTMLElement
>;
export type DropdownMenuSubContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DropdownMenuContentOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface DropdownMenuPartOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}
export type DropdownMenuPartProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  DropdownMenuPartOwnProps,
  Record<string, never>,
  HTMLElement
>;
export type DropdownMenuGroupOwnProps = DropdownMenuPartOwnProps;
export type DropdownMenuLabelOwnProps = DropdownMenuPartOwnProps;
export type DropdownMenuSeparatorOwnProps = Omit<DropdownMenuPartOwnProps, "children">;
export type DropdownMenuGroupProps<TAs extends ElementType = "div"> = MenuGroupProps<TAs>;
export type DropdownMenuLabelProps<TAs extends ElementType = "div"> = MenuLabelProps<TAs>;
export type DropdownMenuSeparatorProps<TAs extends ElementType = "div"> = MenuSeparatorProps<TAs>;
export type DropdownMenuItemIconProps<TAs extends ElementType = "span"> =
  DropdownMenuPartProps<TAs>;
export type DropdownMenuItemTextProps<TAs extends ElementType = "span"> =
  DropdownMenuPartProps<TAs>;
export type DropdownMenuItemDescriptionProps<TAs extends ElementType = "span"> =
  DropdownMenuPartProps<TAs>;
export type DropdownMenuShortcutProps<TAs extends ElementType = "span"> =
  DropdownMenuPartProps<TAs>;
export type DropdownMenuItemIndicatorProps<TAs extends ElementType = "span"> =
  DropdownMenuPartProps<TAs>;

export interface DropdownMenuSubContextValue {
  readonly contentRef: RefObject<HTMLElement | null>;
  readonly open: boolean;
  readonly setOpen: (
    open: boolean,
    reason: DropdownMenuOpenChangeReason,
    event?: Event | null,
  ) => void;
  readonly triggerRef: RefObject<HTMLElement | null>;
}
