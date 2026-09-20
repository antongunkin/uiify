"use client";

import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";

/**
 * Mirrors `ref.current` into state so effects can subscribe when the node
 * attaches after mount (e.g. conditional rendering) without relying on ref
 * object identity changes.
 */
export function useRefElement<T extends EventTarget>(ref: RefObject<T | null> | null): T | null {
  const [element, setElement] = useState<T | null>(null);
  const syncedRef = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref) {
      if (syncedRef.current !== null) {
        syncedRef.current = null;
        setElement(null);
      }
      return;
    }

    const next = ref.current;
    if (syncedRef.current === next) return;
    syncedRef.current = next;
    setElement(next);
  });

  return ref ? element : null;
}
