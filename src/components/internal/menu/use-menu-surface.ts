"use client";

import { useCallback, useRef } from "react";
import { useAnchorPosition } from "@gunkin/uiify/core/anchor-position";
import { usePopover } from "@gunkin/uiify/core/popover";
import { useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { focusMenuItem } from "./focus-menu-item.js";
import type { UseMenuSurfaceOptions, UseMenuSurfaceReturn } from "./types.js";

/**
 * Shared body of DropdownMenu and ContextMenu's per-menu state: a popover
 * surface anchored to its invoker, with focus management for opening into the
 * item list and returning to the trigger.
 *
 * `anchorRef`/`positionerRef` are deliberately not part of the return value —
 * `useAnchorPosition` returns no-op refs for both (see core/use-anchor-position.ts),
 * so the menu compounds were merging them into their DOM ref for nothing.
 */
export function useMenuSurface(options: UseMenuSurfaceOptions): UseMenuSurfaceReturn {
  const { align, defaultOpen, mode, onOpenChange, open, side } = options;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const popover = usePopover({
    mode,
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const anchor = useAnchorPosition({
    ...(align !== undefined ? { align } : {}),
    ...(side !== undefined ? { side } : {}),
  });

  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const setTriggerElement = useCallback((element: HTMLElement | null) => {
    triggerRef.current = element;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (popover.open) focusMenuItem(contentRef.current);
  }, [popover.open]);

  const openToItem = useCallback(
    (last?: boolean) => {
      if (!popover.open) popover.openPopover();
      queueMicrotask(() => focusMenuItem(contentRef.current, last !== undefined ? { last } : {}));
    },
    [popover],
  );

  return {
    anchorProps: anchor.anchorProps,
    close: popover.close,
    contentRef,
    focusTrigger,
    open: popover.open,
    openPopover: popover.openPopover,
    openToItem,
    popupProps: popover.popupProps,
    popupRef: popover.popupRef,
    positionerProps: anchor.positionerProps,
    setTriggerElement,
    triggerProps: popover.triggerProps,
    triggerRef,
  };
}
