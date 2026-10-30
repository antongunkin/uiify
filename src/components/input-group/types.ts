import type { ElementType, ReactNode } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";
import type { ControlSize } from "../internal/control-size/types.js";

export interface InputGroupRootOwnProps {
  readonly children?: ReactNode;
  /** Sets the control's height and text size; `md` is the default. */
  readonly size?: ControlSize;
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
