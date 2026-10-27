import type { ComponentPropsWithRef, ElementType } from "react";
import type { ConsumerDataAttributes } from "../../core/slot-props.js";
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

type AvatarImageOwnedAttributes = {
  readonly "data-part"?: never;
  readonly "data-uiify-avatar"?: never;
};

export type AvatarImageSlotProps = Omit<
  ComponentPropsWithRef<"img">,
  "alt" | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-avatar" | "src"
> &
  AvatarImageOwnedAttributes &
  ConsumerDataAttributes;

type AvatarFallbackOwnedAttributes = {
  readonly "aria-hidden"?: never;
  readonly "data-part"?: never;
  readonly "data-uiify-avatar"?: never;
};

export type AvatarFallbackSlotProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-hidden" | "children" | "dangerouslySetInnerHTML" | "data-part" | "data-uiify-avatar"
> &
  AvatarFallbackOwnedAttributes &
  ConsumerDataAttributes;

export interface AvatarSlotProps {
  readonly image?: AvatarImageSlotProps;
  readonly fallback?: AvatarFallbackSlotProps;
}
