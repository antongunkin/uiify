import type { ElementType } from "react";
import type { SlotProps } from "../../core/slot-props.js";
import type { RenderableProps } from "@gunkin/uiify/core/render";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarOwnProps {
  readonly name: string;
  readonly fallback: string;
  readonly src?: string;
  readonly size?: AvatarSize;
  readonly children?: never;
  readonly slotProps?: AvatarSlotProps;
}

export type AvatarProps<TAs extends ElementType = "span"> = RenderableProps<
  TAs,
  AvatarOwnProps,
  Record<string, never>,
  HTMLElement
>;

export type AvatarImageSlotProps = SlotProps<"img">;

export type AvatarFallbackSlotProps = SlotProps<"span">;

export interface AvatarSlotProps {
  readonly image?: AvatarImageSlotProps;
  readonly fallback?: AvatarFallbackSlotProps;
}
