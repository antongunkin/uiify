import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface DescriptionListOwnProps {
  readonly children?: ReactNode;
}

export type DescriptionListProps<TAs extends ElementType = "dl"> = RenderableProps<
  TAs,
  DescriptionListOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface DescriptionTermOwnProps {
  readonly children?: ReactNode;
}

export type DescriptionTermProps<TAs extends ElementType = "dt"> = RenderableProps<
  TAs,
  DescriptionTermOwnProps,
  Record<string, never>,
  HTMLElement
>;

export interface DescriptionDetailsOwnProps {
  readonly children?: ReactNode;
}

export type DescriptionDetailsProps<TAs extends ElementType = "dd"> = RenderableProps<
  TAs,
  DescriptionDetailsOwnProps,
  Record<string, never>,
  HTMLElement
>;
