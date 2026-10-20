import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface ItemOwnProps {
  readonly children?: ReactNode;
}

export type ItemProps<TAs extends ElementType = "li"> = RenderableProps<
  TAs,
  ItemOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ItemMediaOwnProps {
  readonly children?: ReactNode;
}

export type ItemMediaProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  ItemMediaOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ItemContentOwnProps {
  readonly children?: ReactNode;
}

export type ItemContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ItemContentOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ItemMetadataOwnProps {
  readonly children?: ReactNode;
}

export type ItemMetadataProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ItemMetadataOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface ItemActionsOwnProps {
  readonly children?: ReactNode;
}

export type ItemActionsProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  ItemActionsOwnProps,
  Record<string, never>,
  HTMLElement
>;
