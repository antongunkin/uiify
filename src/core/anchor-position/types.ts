import type { HTMLAttributes, RefCallback } from "react";

export type AnchorSide = "top" | "right" | "bottom" | "left";
export type AnchorAlign = "start" | "center" | "end";

export interface UseAnchorPositionOptions {
  readonly align?: AnchorAlign;
  readonly side?: AnchorSide;
  readonly anchorName?: string;
}

export interface AnchorPositionAnchorProps extends HTMLAttributes<HTMLElement> {
  readonly "data-anchor": string;
}

export interface AnchorPositionerProps extends HTMLAttributes<HTMLElement> {
  readonly "data-align": AnchorAlign;
  readonly "data-anchor": string;
  readonly "data-positioning": "native";
  readonly "data-side": AnchorSide;
}

export interface UseAnchorPositionReturn {
  readonly anchorProps: AnchorPositionAnchorProps;
  readonly anchorRef: RefCallback<HTMLElement>;
  readonly positionerProps: AnchorPositionerProps;
  readonly positionerRef: RefCallback<HTMLElement>;
  readonly positioning: "native";
}

export interface CreateAnchorPositionerPropsOptions {
  readonly align?: AnchorAlign;
  readonly anchorName: string;
  readonly side?: AnchorSide;
}
