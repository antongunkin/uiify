"use client";

import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.js";

/**
 * Returns a memoized function whose identity never changes but which always
 * invokes the most recent `callback`. Use to pass event handlers into effects
 * without re-running them on every render.
 */
export function useEventCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R,
): (...args: Args) => R {
  const ref = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  });
  return useCallback((...args: Args) => ref.current(...args), []);
}
