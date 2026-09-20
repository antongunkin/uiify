"use client";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";
import { lockScroll, unlockScroll } from "./utils/scroll-lock.js";

/** Locks page scroll while `locked` is true (default), without layout shift. */
export function useLockBodyScroll(locked = true): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked || typeof document === "undefined") return;
    const root = document.documentElement;
    lockScroll(root);
    return () => unlockScroll(root);
  }, [locked]);
}
