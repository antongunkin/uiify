import type { HTMLAttributes, ReactNode } from "react";
import type { Direction } from "@gunkin/uiify/core/direction";
import type { RovingFocusOrientation } from "@gunkin/uiify/core/roving-focus";
import type { ToggleGroupProps } from "../toggle-group/types.js";

export interface ToolbarRootOwnProps {
  readonly dir?: Direction;
  readonly loop?: boolean;
  readonly orientation?: RovingFocusOrientation;
}

export interface ToolbarRootProps
  extends ToolbarRootOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof ToolbarRootOwnProps> {}

export interface ToolbarButtonOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
}

export interface ToolbarButtonProps
  extends
    ToolbarButtonOwnProps,
    Omit<HTMLAttributes<HTMLButtonElement>, keyof ToolbarButtonOwnProps | "disabled"> {}

export interface ToolbarLinkOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly href: string;
}

export interface ToolbarLinkProps
  extends
    ToolbarLinkOwnProps,
    Omit<HTMLAttributes<HTMLAnchorElement>, keyof ToolbarLinkOwnProps | "href"> {}

export interface ToolbarSeparatorOwnProps {
  readonly className?: string;
  readonly orientation?: "horizontal" | "vertical";
}

export type ToolbarSeparatorProps = ToolbarSeparatorOwnProps &
  Omit<HTMLAttributes<HTMLHRElement>, keyof ToolbarSeparatorOwnProps>;

export type ToolbarToggleGroupProps = ToggleGroupProps;
