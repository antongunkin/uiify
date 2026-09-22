"use client";

import { useRef } from "react";
import type {
  CSSProperties,
  ElementType,
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
} from "react";
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
import { CONTENT_HOVER_GRACE_MS, createTooltipProviderStore } from "./tooltip-store.js";
import type {
  TooltipContentProps,
  TooltipProviderOwnProps,
  TooltipProviderStore,
  TooltipRootProps,
  TooltipTriggerProps,
} from "./types.js";

interface TooltipClientContextValue {
  readonly anchorId: string;
  readonly closeTooltip: () => void;
  readonly contentId: string;
  readonly intent: HoverIntentStore;
  readonly open: boolean;
  readonly openTooltip: (immediate?: boolean) => void;
  readonly pointerFocusRef: React.RefObject<boolean>;
  readonly setContentId: (id: string) => void;
}

const [TooltipProviderStoreProvider, useTooltipProviderStore] =
  createPartContext<TooltipProviderStore>("Tooltip", "Provider");

// Root name "Root" (the default): Trigger/Content require <Tooltip.Root>, a
// distinct nesting requirement from TooltipRoot itself requiring
// <Tooltip.Provider> above. Keeping the two contexts' root names accurate
// (rather than pointing both at "Provider") preserves the original's
// correct, non-misleading error for the "Trigger without Root" case.
const [TooltipContextProvider, useTooltipContext] =
  createPartContext<TooltipClientContextValue>("Tooltip");

export function TooltipProvider(props: TooltipProviderOwnProps): ReactElement | null {
  const { children, delayDuration = 300, skipDelayDuration = 300 } = props;
  const storeRef = useRef<TooltipProviderStore | null>(null);
  storeRef.current ??= createTooltipProviderStore({ delayDuration, skipDelayDuration });

  useIsomorphicLayoutEffect(() => {
    storeRef.current?.updateOptions({ delayDuration, skipDelayDuration });
  }, [delayDuration, skipDelayDuration]);

  return (
    <TooltipProviderStoreProvider value={storeRef.current}>{children}</TooltipProviderStoreProvider>
  );
}
TooltipProvider.displayName = "TooltipProvider";

export function TooltipRoot(props: TooltipRootProps): ReactElement | null {
  const { children, defaultOpen = false, id, onOpenChange, open } = props;
  const provider = useTooltipProviderStore("Root");
  const pointerFocusRef = useRef(false);
  const overlay = useHoverOverlay({
    closeDelay: CONTENT_HOVER_GRACE_MS,
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(id !== undefined ? { id } : {}),
    idPrefix: "uiify-tooltip",
    ...(onOpenChange ? { onOpenChange } : {}),
    onOpened: provider.markOpened,
    ...(open !== undefined ? { open } : {}),
    openDelay: provider.getDelayDuration(),
    shouldSkipDelay: provider.shouldSkipDelay,
  });

  const contextValue: TooltipClientContextValue = {
    anchorId: overlay.anchorId,
    closeTooltip: overlay.closeOverlay,
    contentId: overlay.contentId,
    intent: overlay.intent,
    open: overlay.open,
    openTooltip: overlay.openOverlay,
    pointerFocusRef,
    setContentId: overlay.setContentId,
  };

  return <TooltipContextProvider value={contextValue}>{children}</TooltipContextProvider>;
}
TooltipRoot.displayName = "TooltipRoot";

export function TooltipTrigger<TAs extends ElementType = "button">(
  props: TooltipTriggerProps<TAs>,
): ReactElement | null {
  const { as, render, className, ...consumerProps } = props as TooltipTriggerProps<"button">;
  const { anchorId, closeTooltip, contentId, intent, open, openTooltip, pointerFocusRef } =
    useTooltipContext("Trigger");
  const nativeButton = !as || as === "button";
  const consumerStyle = (consumerProps as { style?: CSSProperties }).style;
  const anchorProps = {
    ...createAnchorTriggerProps(anchorNameForId(anchorId)),
    ...(consumerStyle ? { style: consumerStyle } : {}),
  };
  const {
    onBlur: consumerOnBlur,
    onFocus: consumerOnFocus,
    onKeyDown: consumerOnKeyDown,
    onPointerDown: consumerOnPointerDown,
    onPointerEnter: consumerOnPointerEnter,
    onPointerLeave: consumerOnPointerLeave,
  } = consumerProps as {
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  };

  return useRenderElement({
    as,
    defaultTag: "button",
    props: {
      ...consumerProps,
      ...anchorProps,
      "aria-describedby": open ? contentId : undefined,
      ...(nativeButton ? { type: "button" } : {}),
      ...(className ? { className } : {}),
      onBlur: composeEventHandlers(consumerOnBlur, () => {
        closeTooltip();
      }),
      onFocus: composeEventHandlers(consumerOnFocus, () => {
        if (!pointerFocusRef.current) openTooltip(true);
        pointerFocusRef.current = false;
      }),
      onKeyDown: composeEventHandlers(consumerOnKeyDown, (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Escape") closeTooltip();
      }),
      onPointerDown: composeEventHandlers(consumerOnPointerDown, () => {
        pointerFocusRef.current = true;
      }),
      onPointerEnter: composeEventHandlers(
        consumerOnPointerEnter,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") openTooltip(false);
        },
      ),
      onPointerLeave: composeEventHandlers(
        consumerOnPointerLeave,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") {
            intent.scheduleClose(() => closeTooltip());
          }
        },
      ),
    },
    render,
    state: { open },
  });
}

export function TooltipContent<TAs extends ElementType = "div">(
  props: TooltipContentProps<TAs>,
): ReactElement | null {
  const {
    align = "center",
    as,
    render,
    className,
    side = "bottom",
    ...consumerProps
  } = props as TooltipContentProps<"div">;
  const { anchorId, closeTooltip, contentId, intent, open, setContentId } =
    useTooltipContext("Content");
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
      // The consumer's own non-empty `id` wins (computed above as `resolvedId`); otherwise the
      // The consumer's own non-empty `id` wins; otherwise the context-generated id is used.
      id: resolvedId,
      role: "tooltip",
      "data-part": "content",
      "data-uiify-tooltip": "",
      "data-state": open ? "open" : "closed",
      ...(className ? { className } : {}),
      onPointerEnter: composeEventHandlers(consumerOnPointerEnter, () => {
        intent.clearCloseTimer();
      }),
      onPointerLeave: composeEventHandlers(
        consumerOnPointerLeave,
        (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType === "mouse") closeTooltip();
        },
      ),
    },
    render,
    state: { open, positioning: "native" as const },
  });
}

export const Tooltip = {
  Content: TooltipContent,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
};
