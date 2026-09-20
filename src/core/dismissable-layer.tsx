"use client";

import { useRef } from "react";
import type { ElementType, ReactElement, Ref } from "react";
import { useEventCallback, useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import { registerDismissableLayer } from "./dismissable-layer-registry.js";
import {
  createOpenChangeDetails,
  type OpenChangeDetails,
  type OpenChangeReason,
} from "./open-change-details.js";
import type { RenderableProps } from "./polymorphic.js";
import { getOwnerDocument } from "./platform.js";
import { useRenderElement } from "./use-render-element.js";

export interface DismissableLayerOwnProps {
  readonly branches?: ReadonlySet<Element>;
  readonly onDismiss?: (details: OpenChangeDetails) => void;
}

export type DismissableLayerProps<TAs extends ElementType = "div"> = RenderableProps<
  TAs,
  DismissableLayerOwnProps,
  { active: boolean },
  HTMLElement
>;

export function DismissableLayer<TAs extends ElementType = "div">(
  props: DismissableLayerProps<TAs>,
): ReactElement | null {
  const {
    as,
    branches,
    onDismiss,
    ref: consumerRef,
    render,
    ...consumerProps
  } = props as DismissableLayerProps<ElementType> & { ref?: Ref<HTMLElement> };
  const elementRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(elementRef, consumerRef);
  const emitDismiss = useEventCallback((reason: OpenChangeReason, event: Event) => {
    onDismiss?.(createOpenChangeDetails(reason, event));
  });

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    const document = getOwnerDocument(element);
    if (!element || !document) return;
    return registerDismissableLayer(document, {
      branches: new Set(branches),
      element,
      onDismiss: emitDismiss,
    });
  }, [branches, emitDismiss]);

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...consumerProps,
      ref: mergedRef,
    },
    render,
    state: { active: true },
  });
}
