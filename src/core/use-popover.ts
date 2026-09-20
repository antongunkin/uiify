"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  RefCallback,
} from "react";
import { useId, useIsomorphicLayoutEffect } from "@gunkin/uiify/hooks";
import { supportsPopover } from "./platform.js";
import {
  useControllableOpenChange,
  type UseControllableOpenChangeOptions,
} from "./use-controllable-open-change.js";

export type PopoverMode = "auto" | "manual" | "hint";
export type PopoverChangeHandler = UseControllableOpenChangeOptions["onOpenChange"];

export interface UsePopoverOptions extends UseControllableOpenChangeOptions {
  readonly mode?: PopoverMode;
}

export interface UsePopoverReturn {
  readonly close: () => void;
  readonly isNative: boolean;
  readonly open: boolean;
  readonly openPopover: () => void;
  readonly popupProps: HTMLAttributes<HTMLElement>;
  readonly popupRef: RefCallback<HTMLElement>;
  readonly toggle: () => void;
  readonly triggerProps: ButtonHTMLAttributes<HTMLButtonElement>;
  readonly triggerRef: RefCallback<HTMLButtonElement>;
}

interface ToggleEventLike extends Event {
  readonly newState?: "closed" | "open";
}

export function usePopover({
  defaultOpen = false,
  mode = "auto",
  onOpenChange,
  open: controlledOpen,
}: UsePopoverOptions = {}): UsePopoverReturn {
  const id = useId();
  const [popup, setPopup] = useState<HTMLElement | null>(null);
  const { open, requestChange } = useControllableOpenChange({
    defaultOpen,
    onOpenChange,
    open: controlledOpen,
  });
  const openRef = useRef(open);
  openRef.current = open;
  // SSR markup matches the initial open state so pre-hydration toggling works.
  const isNative = useSyncExternalStore(
    () => () => {},
    () => supportsPopover(),
    () => true,
  );

  useIsomorphicLayoutEffect(() => {
    if (!popup || !isNative) return;

    const onBeforeToggle = (event: Event) => {
      const next = (event as ToggleEventLike).newState === "open";
      if (next !== openRef.current && !requestChange(next, "native-toggle", event)) {
        event.preventDefault();
      }
    };
    popup.addEventListener("beforetoggle", onBeforeToggle);
    return () => popup.removeEventListener("beforetoggle", onBeforeToggle);
  }, [isNative, popup, requestChange]);

  useIsomorphicLayoutEffect(() => {
    if (!popup || !isNative) return;
    try {
      if (open && !popup.matches(":popover-open")) popup.showPopover();
      if (!open && popup.matches(":popover-open")) popup.hidePopover();
    } catch {
      // The node may have disconnected between render and layout effect.
    }
  }, [isNative, open, popup]);

  const triggerProps = {
    "aria-controls": id,
    "aria-expanded": open,
    onClick(event: ReactMouseEvent<HTMLButtonElement>) {
      if (!isNative) requestChange(!open, "trigger-press", event.nativeEvent);
    },
    type: "button",
    ...(isNative ? { command: "toggle-popover", commandfor: id } : {}),
  } as ButtonHTMLAttributes<HTMLButtonElement>;

  const popupProps = {
    "data-native": isNative ? "" : undefined,
    hidden: isNative ? undefined : !open,
    id,
    ...(isNative ? { popover: mode } : {}),
    ...(isNative && open ? { open: true } : {}),
  } as HTMLAttributes<HTMLElement>;

  return {
    close: () => requestChange(false, "programmatic"),
    isNative,
    open,
    openPopover: () => requestChange(true, "programmatic"),
    popupProps,
    popupRef: setPopup,
    toggle: () => requestChange(!open, "programmatic"),
    triggerProps,
    triggerRef() {},
  };
}
