"use client";

import { useCallback, useRef, useState } from "react";
import { useControllableState, useId, useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { createHoverIntentStore, type HoverIntentStore } from "./hover-intent-store.js";
import { emitProgrammaticOpenChange } from "./open-change-details.js";
import type { PopoverChangeHandler } from "./popover.js";

export interface UseHoverOverlayOptions {
  readonly closeDelay: number;
  readonly defaultOpen?: boolean;
  readonly id?: string;
  readonly idPrefix: string;
  readonly onOpenChange?: PopoverChangeHandler;
  /** Called after the overlay actually opened — Tooltip's provider records it for skip-delay. */
  readonly onOpened?: () => void;
  readonly open?: boolean;
  readonly openDelay: number;
  /** When it returns true the open delay is skipped — Tooltip's group behavior. */
  readonly shouldSkipDelay?: () => boolean;
}

export interface UseHoverOverlayReturn {
  readonly anchorId: string;
  readonly closeOverlay: () => void;
  readonly contentId: string;
  readonly intent: HoverIntentStore;
  readonly open: boolean;
  readonly openOverlay: (immediate?: boolean) => void;
  readonly setContentId: (id: string) => void;
}

/**
 * Shared body of TooltipRoot and HoverCardRoot: controllable open state, a
 * hover-intent timer pair, and a content id that a Content part can override.
 *
 * Tooltip's group skip-delay (several tooltips sharing one Provider) has no
 * equivalent in HoverCard, so it is not part of this contract — the two hooks
 * (`shouldSkipDelay`, `onOpened`) are how Tooltip's Provider plugs in without
 * adding a Tooltip-specific concept to the primitive itself.
 */
export function useHoverOverlay(options: UseHoverOverlayOptions): UseHoverOverlayReturn {
  const {
    closeDelay,
    defaultOpen = false,
    id,
    idPrefix,
    onOpenChange,
    onOpened,
    open,
    openDelay,
    shouldSkipDelay,
  } = options;
  const generatedId = useId(id, idPrefix);
  const [resolvedOpen, setResolvedOpen] = useControllableState<boolean>({
    defaultValue: defaultOpen,
    ...(onOpenChange
      ? { onChange: (next: boolean) => emitProgrammaticOpenChange(onOpenChange, next) }
      : {}),
    ...(open !== undefined ? { value: open } : {}),
  });
  const [contentId, setContentId] = useState(`${generatedId}-content`);
  const intentRef = useRef<HoverIntentStore | null>(null);
  intentRef.current ??= createHoverIntentStore({ closeDelay, openDelay });

  useIsomorphicLayoutEffect(() => {
    intentRef.current?.updateOptions({ closeDelay, openDelay });
  }, [closeDelay, openDelay]);

  const openOverlay = useCallback(
    (immediate = false) => {
      const intent = intentRef.current;
      if (!intent) return;
      intent.clearCloseTimer();
      const delay = immediate || (shouldSkipDelay?.() ?? false) ? 0 : openDelay;
      intent.scheduleOpen(() => {
        setResolvedOpen(true);
        onOpened?.();
      }, delay);
    },
    [onOpened, openDelay, setResolvedOpen, shouldSkipDelay],
  );

  const closeOverlay = useCallback(() => {
    intentRef.current?.clearAll();
    setResolvedOpen(false);
  }, [setResolvedOpen]);

  useIsomorphicLayoutEffect(
    () => () => {
      intentRef.current?.clearAll();
    },
    [],
  );

  return {
    anchorId: generatedId,
    closeOverlay,
    contentId,
    intent: intentRef.current!,
    open: resolvedOpen,
    openOverlay,
    setContentId,
  };
}
