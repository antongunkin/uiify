"use client";

import { useCallback } from "react";
import { useControllableState, useEventCallback } from "@gunkin/uiify/hooks";
import {
  createOpenChangeDetails,
  type OpenChangeDetails,
  type OpenChangeReason,
} from "./open-change-details.js";

export interface UseControllableOpenChangeOptions {
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: ((open: boolean, details: OpenChangeDetails) => void) | undefined;
  readonly open?: boolean | undefined;
}

export interface UseControllableOpenChangeReturn {
  readonly open: boolean;
  readonly requestChange: (
    next: boolean,
    reason: OpenChangeReason,
    event?: Event | null,
  ) => boolean;
}

/** Shared controllable open state with cancellable `OpenChangeDetails`. */
export function useControllableOpenChange({
  defaultOpen = false,
  onOpenChange,
  open: controlledOpen,
}: UseControllableOpenChangeOptions = {}): UseControllableOpenChangeReturn {
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
  });
  const emitChange = useEventCallback((next: boolean, details: OpenChangeDetails) => {
    onOpenChange?.(next, details);
    if (!details.isCanceled) setOpen(next);
  });
  const requestChange = useCallback(
    (next: boolean, reason: OpenChangeReason, event: Event | null = null) => {
      const details = createOpenChangeDetails(reason, event);
      emitChange(next, details);
      return !details.isCanceled;
    },
    [emitChange],
  );

  return { open, requestChange };
}
