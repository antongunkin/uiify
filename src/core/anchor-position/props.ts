import type {
  AnchorPositionAnchorProps,
  AnchorPositionerProps,
  CreateAnchorPositionerPropsOptions,
} from "./types.js";

/** Deterministic anchor name from a stable root id. */
export function anchorNameForId(id: string): string {
  return `--${id}-anchor`;
}

export function createAnchorTriggerProps(anchorName: string): AnchorPositionAnchorProps {
  return { "data-anchor": anchorName };
}

export function createAnchorPositionerProps({
  align = "center",
  anchorName,
  side = "bottom",
}: CreateAnchorPositionerPropsOptions): AnchorPositionerProps {
  return {
    "data-align": align,
    "data-anchor": anchorName,
    "data-positioning": "native",
    "data-side": side,
  };
}
