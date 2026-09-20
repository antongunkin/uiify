"use client";

import { useEffect, useMemo } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { createDebouncedFn, type RateLimitedFn } from "./utils/rate-limit.js";

export type DebouncedFn<Args extends unknown[]> = RateLimitedFn<Args>;

/** Returns a stable debounced function (trailing edge) with `.cancel()`. */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): DebouncedFn<Args> {
  const onCall = useEventCallback(callback);
  const debounced = useMemo(() => createDebouncedFn(onCall, delay), [delay, onCall]);
  useEffect(() => () => debounced.cancel(), [debounced]);
  return debounced;
}
