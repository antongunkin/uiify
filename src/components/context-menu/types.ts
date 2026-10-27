import type { ComponentPropsWithRef, ElementType, MouseEvent, ReactNode } from "react";
import type { PopoverChangeHandler } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ConsumerDataAttributes } from "@gunkin/uiify/core/slot-props";
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
  readonly slotProps?: ContextMenuRootSlotProps;
}

export interface ContextMenuRootSlotProps {
  readonly virtualAnchor?: Omit<
    ComponentPropsWithRef<"span">,
    | "aria-hidden"
    | "children"
    | "dangerouslySetInnerHTML"
    | "data-anchor"
    | "data-virtual-anchor"
    | "data-uiify-menu"
  > &
    ConsumerDataAttributes & {
      readonly "data-anchor"?: never;
      readonly "data-uiify-menu"?: never;
      readonly "data-virtual-anchor"?: never;
    };
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

export interface ContextMenuCheckboxItemOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "aria-checked"
      | "children"
      | "data-disabled"
      | "data-part"
      | "data-state"
      | "data-uiify-menu"
      | "dangerouslySetInnerHTML"
      | "role"
    >,
    ConsumerDataAttributes {
  readonly checked?: boolean | "indeterminate";
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly textValue?: string;
  readonly "aria-checked"?: never;
  readonly "data-disabled"?: never;
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-menu"?: never;
  readonly role?: never;
}

export interface ContextMenuRadioItemOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "aria-checked"
      | "children"
      | "data-disabled"
      | "data-part"
      | "data-state"
      | "data-uiify-menu"
      | "dangerouslySetInnerHTML"
      | "role"
    >,
    ConsumerDataAttributes {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly textValue?: string;
  readonly value: string;
  readonly "aria-checked"?: never;
  readonly "data-disabled"?: never;
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-menu"?: never;
  readonly role?: never;
}

export interface ContextMenuSubOwnProps {
  readonly children?: ReactNode;
}

export interface ContextMenuSubTriggerOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "aria-expanded"
      | "aria-haspopup"
      | "children"
      | "data-part"
      | "data-uiify-menu"
      | "dangerouslySetInnerHTML"
      | "role"
    >,
    ConsumerDataAttributes {
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly textValue?: string;
  readonly "aria-expanded"?: never;
  readonly "aria-haspopup"?: never;
  readonly "data-part"?: never;
  readonly "data-uiify-menu"?: never;
  readonly role?: never;
}

export interface ContextMenuSubContentOwnProps
  extends
    Omit<
      ComponentPropsWithRef<"div">,
      | "children"
      | "data-part"
      | "data-state"
      | "data-uiify-menu"
      | "dangerouslySetInnerHTML"
      | "hidden"
      | "role"
    >,
    ConsumerDataAttributes {
  readonly children?: ReactNode;
  readonly "data-part"?: never;
  readonly "data-state"?: never;
  readonly "data-uiify-menu"?: never;
  readonly role?: never;
}
