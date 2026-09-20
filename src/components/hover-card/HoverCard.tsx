"use client";

import { useRef } from "react";
import type { CSSProperties, ElementType, FocusEvent, PointerEvent, ReactElement } from "react";
import { useIsomorphicLayoutEffect, useMergedRefs } from "@gunkin/uiify/hooks";
import {
  createAnchorPositionerProps,
  createAnchorTriggerProps,
  anchorNameForId,
} from "@gunkin/uiify/core/anchor-position";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import {
  createPartContext,
  splitRef,
  useHoverOverlay,
  type HoverIntentStore,
} from "@gunkin/uiify/core";
import { useRenderElement } from "@gunkin/uiify/core/render";
import type { HoverCardContentProps, HoverCardRootProps, HoverCardTriggerProps } from "./types.js";

interface HoverCardClientContextValue {
  readonly anchorId: string;
  readonly closeCard: () => void;
  readonly contentId: string;
  readonly intent: HoverIntentStore;
  readonly open: boolean;
  readonly openCard: (immediate?: boolean) => void;
  readonly setContentId: (id: string) => void;
}

const [HoverCardProvider, useHoverCardContext] =
  createPartContext<HoverCardClientContextValue>("HoverCard");

export function HoverCardRoot(props: HoverCardRootProps): ReactElement | null {
  const {
    children,
    closeDelay = 300,
    defaultOpen = false,
    id,
    onOpenChange,
    open,
    openDelay = 700,
  } = props;
  const overlay = useHoverOverlay({
    closeDelay,
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(id !== undefined ? { id } : {}),
    idPrefix: "uiify-hover-card",
    ...(onOpenChange ? { onOpenChange } : {}),
    ...(open !== undefined ? { open } : {}),
    openDelay,
  });

  const contextValue: HoverCardClientContextValue = {
    anchorId: overlay.anchorId,
    closeCard: overlay.closeOverlay,
    contentId: overlay.contentId,
    intent: overlay.intent,
    open: overlay.open,
    openCard: overlay.openOverlay,
    setContentId: overlay.setContentId,
  };

  return <HoverCardProvider value={contextValue}>{children}</HoverCardProvider>;
}
HoverCardRoot.displayName = "HoverCardRoot";

export function HoverCardTrigger<TAs extends ElementType = "button">(
  props: HoverCardTriggerProps<TAs>,
): ReactElement | null {
  const { as, render, className, ...consumerProps } = props as HoverCardTriggerProps<"button">;
  const { anchorId, closeCard, contentId, intent, open, openCard } = useHoverCardContext("Trigger");
  const nativeButton = !as || as === "button";
  const consumerStyle = (consumerProps as { style?: CSSProperties }).style;
  const {
    onBlur: consumerOnBlur,
    onFocus: consumerOnFocus,
    onPointerEnter: consumerOnPointerEnter,
    onPointerLeave: consumerOnPointerLeave,
  } = consumerProps as {
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  };

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      ...createAnchorTriggerProps(anchorNameForId(anchorId)),
      ...(consumerStyle ? { style: consumerStyle } : {}),
      "aria-controls": contentId,
      "aria-expanded": open,
      ...(nativeButton ? { type: "button" } : {}),
      ...(className ? { className } : {}),
      onBlur: composeEventHandlers(consumerOnBlur, (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeCard();
      }),
      onFocus: composeEventHandlers(consumerOnFocus, () => {
        openCard(true);
      }),
      onPointerEnter: composeEventHandlers(
        consumerOnPointerEnter,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") openCard(false);
        },
      ),
      onPointerLeave: composeEventHandlers(
        consumerOnPointerLeave,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") intent.scheduleClose(() => closeCard());
        },
      ),
    },
    render,
    state: { open, positioning: "native" as const },
  });
}

export function HoverCardContent<TAs extends ElementType = "div">(
  props: HoverCardContentProps<TAs>,
): ReactElement | null {
  const {
    align = "center",
    as,
    render,
    className,
    side = "bottom",
    ...consumerProps
  } = props as HoverCardContentProps<"div">;
  const { anchorId, closeCard, contentId, intent, open, setContentId } =
    useHoverCardContext("Content");
  const [consumerRef, domProps] = splitRef<HTMLElement, typeof consumerProps>(consumerProps);
  const popupRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(popupRef, consumerRef);
  const consumerDomProps = domProps as { id?: string; style?: CSSProperties };
  const resolvedId =
    typeof consumerDomProps.id === "string" && consumerDomProps.id.length > 0
      ? consumerDomProps.id
      : contentId;
  const consumerStyle = consumerDomProps.style;

  useIsomorphicLayoutEffect(() => {
    setContentId(resolvedId);
  }, [resolvedId, setContentId]);

  // Same technique as core/use-popover.ts: guard with .matches(":popover-open")
  // so a StrictMode double-invoke or an unrelated re-run doesn't call
  // showPopover/hidePopover on a popover already in that state (both throw).
  // try/catch covers the node having disconnected between render and effect.
  useIsomorphicLayoutEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;
    try {
      if (open && !popup.matches(":popover-open")) popup.showPopover();
      if (!open && popup.matches(":popover-open")) popup.hidePopover();
    } catch {
      // The node may have disconnected between render and layout effect.
    }
  }, [open]);

  const { onPointerEnter: consumerOnPointerEnter, onPointerLeave: consumerOnPointerLeave } =
    domProps as {
      onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
      onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
    };

  return useRenderElement({
    as,
    defaultTag: "div",
    props: {
      ...domProps,
      ...createAnchorPositionerProps({
        align,
        anchorName: anchorNameForId(anchorId),
        side,
      }),
      ...(consumerStyle ? { style: consumerStyle } : {}),
      ref: mergedRef,
      popover: "manual",
      // The consumer's own non-empty `id` wins; otherwise the context-generated id is used.
      id: resolvedId,
      "data-state": open ? "open" : "closed",
      ...(className ? { className } : {}),
      onPointerEnter: composeEventHandlers(consumerOnPointerEnter, () => {
        intent.clearCloseTimer();
      }),
      onPointerLeave: composeEventHandlers(
        consumerOnPointerLeave,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") intent.scheduleClose(() => closeCard());
        },
      ),
    },
    render,
    state: { open, positioning: "native" as const },
  });
}

export const HoverCard = {
  Content: HoverCardContent,
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
};
