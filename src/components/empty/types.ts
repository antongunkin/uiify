import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface EmptyOwnProps {
  readonly children?: ReactNode;
}

export type EmptyProps<TAs extends ElementType = "section"> = RenderableProps<
  TAs,
  EmptyOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface EmptyTitleOwnProps {
  readonly children?: ReactNode;
}

export type EmptyTitleProps<TAs extends ElementType = "h2"> = RenderableProps<
  TAs,
  EmptyTitleOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface EmptyDescriptionOwnProps {
  readonly children?: ReactNode;
}

export type EmptyDescriptionProps<TAs extends ElementType = "p"> = RenderableProps<
  TAs,
  EmptyDescriptionOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface EmptyContentOwnProps {
  readonly children?: ReactNode;
}

export type EmptyContentProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  EmptyContentOwnProps,
  Record<string, never>,
  HTMLElement
>;
