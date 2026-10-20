import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export interface InputGroupRootOwnProps {
  readonly children?: ReactNode;
}

export type InputGroupRootProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  InputGroupRootOwnProps,
  Record<string, never>,
  HTMLDivElement
>;

export interface InputGroupAddonOwnProps {
  readonly align: "start" | "end";
  readonly children?: ReactNode;
}

export type InputGroupAddonProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  InputGroupAddonOwnProps,
  Record<string, never>,
  HTMLSpanElement
>;
