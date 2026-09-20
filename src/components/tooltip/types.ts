import type { ElementType, ReactNode } from "react";
import type { AnchorAlign, AnchorSide } from "@gunkin/uiify/core/anchor-position";
import type { PopoverChangeHandler } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface TooltipProviderOptions {
  readonly delayDuration: number;
  readonly skipDelayDuration: number;
}

export interface TooltipProviderStore {
  readonly getDelayDuration: () => number;
  readonly markOpened: () => void;
  readonly shouldSkipDelay: () => boolean;
  readonly updateOptions: (next: TooltipProviderOptions) => void;
}

export interface TooltipProviderOwnProps {
  readonly children?: ReactNode;
  readonly delayDuration?: number;
  readonly skipDelayDuration?: number;
}

export interface TooltipRootOwnProps {
  readonly defaultOpen?: boolean;
  readonly id?: string;
  readonly onOpenChange?: PopoverChangeHandler;
  readonly open?: boolean;
}

export interface TooltipRootProps extends TooltipRootOwnProps {
  readonly children?: ReactNode;
}

export interface TooltipTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type TooltipTriggerProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  TooltipTriggerOwnProps,
  { open: boolean },
  HTMLElement
>;

export interface TooltipContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly side?: AnchorSide;
}

export type TooltipContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  TooltipContentOwnProps,
  { open: boolean; positioning: "native" },
  HTMLElement
>;
