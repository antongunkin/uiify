"use client";

import { useCallback, useMemo } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { useControllableState, useId } from "@gunkin/uiify/hooks";
import type { HeaderMobileMode, UseHeaderOptions, UseHeaderReturn } from "./types.js";

export type { HeaderMobileMode, UseHeaderOptions, UseHeaderReturn } from "./types.js";

function isDrawerMobileMode(mobileMode: HeaderMobileMode): boolean {
  return mobileMode === "drawer" || mobileMode === "sheet" || mobileMode === "fullscreen";
}

function exposesNavControls(mobileMode: HeaderMobileMode, open: boolean): boolean {
  if (mobileMode === "none") return false;
  if (isDrawerMobileMode(mobileMode)) return true;
  if (mobileMode === "collapse") return true;
  return open;
}

export function useHeader(options: UseHeaderOptions = {}): UseHeaderReturn {
  const {
    closeOnSelect = true,
    defaultOpen = false,
    mobileMode = "none",
    onOpenChange,
    open: controlledOpen,
  } = options;

  const navId = useId();
  const toggleId = useId();
  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: controlledOpen,
  });

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const getToggleProps = useCallback(
    <T extends ButtonHTMLAttributes<HTMLButtonElement>>(props?: T): T =>
      ({
        ...props,
        id: toggleId,
        ...(exposesNavControls(mobileMode, open) ? { "aria-controls": navId } : {}),
        "aria-expanded": open,
      }) as T,
    [mobileMode, navId, open, toggleId],
  );

  const getMobileNavProps = useCallback(
    <T extends HTMLAttributes<HTMLElement>>(props?: T): T =>
      ({
        ...props,
        id: navId,
      }) as T,
    [navId],
  );

  return useMemo(
    () => ({
      close,
      closeOnSelect,
      getMobileNavProps,
      getToggleProps,
      mobileMode,
      navId,
      open,
      setOpen,
      toggle,
      toggleId,
    }),
    [
      close,
      closeOnSelect,
      getMobileNavProps,
      getToggleProps,
      mobileMode,
      navId,
      open,
      setOpen,
      toggle,
      toggleId,
    ],
  );
}
