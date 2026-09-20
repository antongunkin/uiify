"use client";

import { createContext, useContext, useMemo } from "react";
import type { ElementType, PropsWithChildren, ReactElement } from "react";
import { useId } from "@gunkin/uiify/hooks";
import type { RenderableProps } from "./polymorphic.js";
import { createAnchorPositionerProps, createAnchorTriggerProps } from "./anchor-position/props.js";
import type { UseAnchorPositionOptions } from "./anchor-position/types.js";
import { useRenderElement } from "./use-render-element.js";

interface AnchorContextValue {
  readonly anchorProps: ReturnType<typeof createAnchorTriggerProps>;
  readonly positionerProps: ReturnType<typeof createAnchorPositionerProps>;
  readonly positioning: "native";
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

export interface AnchorRootProps extends PropsWithChildren, UseAnchorPositionOptions {
  /** Stable id for deterministic `anchor-name` when provided. */
  readonly id?: string;
}

export function AnchorRoot({ align, anchorName, children, id, side }: AnchorRootProps) {
  const generated = useId(undefined, "ui");
  const resolvedName = anchorName ?? (id ? `--${id}-anchor` : `--${generated}`);
  const value = useMemo<AnchorContextValue>(
    () => ({
      anchorProps: createAnchorTriggerProps(resolvedName),
      positionerProps: createAnchorPositionerProps({
        ...(align ? { align } : {}),
        anchorName: resolvedName,
        ...(side ? { side } : {}),
      }),
      positioning: "native",
    }),
    [align, resolvedName, side],
  );
  return <AnchorContext value={value}>{children}</AnchorContext>;
}
AnchorRoot.displayName = "AnchorRoot";

type AnchorElementProps<TAs extends ElementType> = RenderableProps<
  TAs,
  object,
  { positioning: "native" },
  HTMLElement
>;

export function Anchor<TAs extends ElementType = "button">(
  props: AnchorElementProps<TAs>,
): ReactElement | null {
  const position = useContext(AnchorContext);
  if (!position) throw new Error("Anchor must be used inside AnchorRoot");
  const { as, render, ...consumerProps } = props as AnchorElementProps<ElementType>;
  const buttonProps = !as || as === "button" ? { type: "button" } : {};
  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      ...position.anchorProps,
      ...buttonProps,
    },
    render,
    state: { positioning: position.positioning },
  });
}

export function Positioner<TAs extends ElementType = "div">(
  props: AnchorElementProps<TAs>,
): ReactElement | null {
  const position = useContext(AnchorContext);
  if (!position) throw new Error("Positioner must be used inside AnchorRoot");
  const { as, render, ...consumerProps } = props as AnchorElementProps<ElementType>;
  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      ...position.positionerProps,
    },
    render,
    state: { positioning: position.positioning },
  });
}
