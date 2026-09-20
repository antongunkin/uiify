import type { ElementType, ReactNode } from "react";
import type { AnchorAlign, AnchorSide } from "@gunkin/uiify/core/anchor-position";
import type { PopoverChangeHandler } from "@gunkin/uiify/core/popover";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface HoverCardRootOwnProps {
  readonly closeDelay?: number;
  readonly defaultOpen?: boolean;
  readonly id?: string;
  readonly onOpenChange?: PopoverChangeHandler;
  readonly open?: boolean;
  readonly openDelay?: number;
}

export interface HoverCardRootProps extends HoverCardRootOwnProps {
  readonly children?: ReactNode;
}

export interface HoverCardTriggerOwnProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

export type HoverCardTriggerProps<TAs extends ElementType = "button"> = RenderableProps<
  TAs,
  HoverCardTriggerOwnProps,
  { open: boolean; positioning: "native" },
  HTMLElement
>;

export interface HoverCardContentOwnProps {
  readonly align?: AnchorAlign;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly side?: AnchorSide;
}

export type HoverCardContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  HoverCardContentOwnProps,
  { open: boolean; positioning: "native" },
  HTMLElement
>;
