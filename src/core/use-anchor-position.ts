"use client";

import { useId } from "@gunkin/uiify/hooks";
import type { RefCallback } from "react";
import { createAnchorPositionerProps, createAnchorTriggerProps } from "./anchor-position/props.js";
import type { UseAnchorPositionOptions, UseAnchorPositionReturn } from "./anchor-position/types.js";

const noopRef: RefCallback<HTMLElement> = () => {};

/** Thin hook — emits CSS anchor attributes only; no layout reads or DOM wiring. */
export function useAnchorPosition({
  align = "center",
  anchorName: anchorNameProp,
  side = "bottom",
}: UseAnchorPositionOptions = {}): UseAnchorPositionReturn {
  const generated = `--${useId(undefined, "ui")}`;
  const anchorName = anchorNameProp ?? generated;
  return {
    anchorProps: createAnchorTriggerProps(anchorName),
    anchorRef: noopRef,
    positionerProps: createAnchorPositionerProps({ align, anchorName, side }),
    positionerRef: noopRef,
    positioning: "native",
  };
}
