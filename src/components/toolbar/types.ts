import type { ComponentPropsWithRef, ReactNode } from "react";
import type { Direction } from "@gunkin/uiify/core/direction";
import type { RovingFocusOrientation } from "@gunkin/uiify/core/roving-focus";
import type { ToggleGroupProps } from "../toggle-group/types.js";

export interface ToolbarRootOwnProps {
  readonly dir?: Direction;
  readonly loop?: boolean;
  readonly orientation?: RovingFocusOrientation;
}

export interface ToolbarRootProps
  extends ToolbarRootOwnProps, Omit<ComponentPropsWithRef<"div">, keyof ToolbarRootOwnProps> {}

export interface ToolbarButtonOwnProps {
  /** Toggle state of the button: reported as aria-pressed and styled as selected. */
  readonly selected?: boolean;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
}

export interface ToolbarButtonProps
  extends
    ToolbarButtonOwnProps,
    Omit<ComponentPropsWithRef<"button">, keyof ToolbarButtonOwnProps | "disabled"> {}

export interface ToolbarLinkOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly href: string;
}

export interface ToolbarLinkProps
  extends
    ToolbarLinkOwnProps,
    Omit<ComponentPropsWithRef<"a">, keyof ToolbarLinkOwnProps | "href"> {}

export interface ToolbarSeparatorOwnProps {
  readonly className?: string;
  readonly orientation?: "horizontal" | "vertical";
}

export type ToolbarSeparatorProps = ToolbarSeparatorOwnProps &
  Omit<ComponentPropsWithRef<"hr">, keyof ToolbarSeparatorOwnProps>;

export type ToolbarToggleGroupProps = ToggleGroupProps;
