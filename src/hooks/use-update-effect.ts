"use client";

import { useEffect, useRef } from "react";
import type { DependencyList, EffectCallback } from "react";

/** Like `useEffect`, but skips the initial mount — runs only on updates. */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) return;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Declared after the update effect so StrictMode's setup/cleanup replay keeps
  // the update effect in its initial "not mounted" state both times.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
}
