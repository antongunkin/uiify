import type { ElementType } from "react";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarOwnProps {
  readonly name: string;
  readonly fallback: string;
  readonly src?: string;
  readonly size?: AvatarSize;
  readonly children?: never;
}

export type AvatarProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  AvatarOwnProps,
  Record<string, never>,
  HTMLElement
>;
