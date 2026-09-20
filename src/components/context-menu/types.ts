import type { ElementType, MouseEvent, ReactNode } from "react";
import type { PopoverChangeHandler } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type {
  DropdownMenuLabelOwnProps,
  DropdownMenuSeparatorOwnProps,
} from "../dropdown-menu/types.js";
import type { MenuSelectEvent, UseMenuSurfaceReturn } from "../internal/menu/types.js";

export type ContextMenuLabelOwnProps = DropdownMenuLabelOwnProps;

export type ContextMenuSeparatorOwnProps = DropdownMenuSeparatorOwnProps;

export interface ContextMenuContextValue extends UseMenuSurfaceReturn {
  /** Opens at the pointer's coordinates: positions the virtual anchor, then opens. */
  readonly openAtPointer: (event: MouseEvent<HTMLElement>) => void;
  readonly radioValue: string | undefined;
  readonly setRadioValue: (value: string) => void;
}

export interface ContextMenuRootShellOwnProps {
  readonly defaultOpen?: boolean;
  readonly id?: string;
}

export interface ContextMenuRootControlledOwnProps {
  readonly onOpenChange?: PopoverChangeHandler;
  readonly open?: boolean;
}

export interface ContextMenuRootShellProps extends ContextMenuRootShellOwnProps {
  readonly children?: ReactNode;
}

export interface ContextMenuRootProps
  extends ContextMenuRootShellOwnProps, ContextMenuRootControlledOwnProps {
  readonly children?: ReactNode;
}

export interface ContextMenuTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type ContextMenuTriggerProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ContextMenuTriggerOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface ContextMenuContentOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type ContextMenuContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ContextMenuContentOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface ContextMenuItemOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onSelect?: (event: MenuSelectEvent) => void;
  readonly textValue?: string;
}

export type ContextMenuItemProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ContextMenuItemOwnProps,
  { disabled: boolean },
  HTMLElement
>;

export interface ContextMenuCheckboxItemOwnProps {
  readonly checked?: boolean | "indeterminate";
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly textValue?: string;
}

export interface ContextMenuRadioItemOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly textValue?: string;
  readonly value: string;
}

export interface ContextMenuSubOwnProps {
  readonly children?: ReactNode;
}

export interface ContextMenuSubTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly textValue?: string;
}

export interface ContextMenuSubContentOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}
