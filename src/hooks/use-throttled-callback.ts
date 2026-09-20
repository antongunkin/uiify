"use client";

import { useEffect, useMemo } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { createThrottledFn, type RateLimitedFn } from "./utils/rate-limit.js";

export type ThrottledFn<Args extends unknown[]> = RateLimitedFn<Args>;

/** Returns a stable throttled function (leading + trailing) with `.cancel()`. */
export function useThrottledCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): ThrottledFn<Args> {
  const onCall = useEventCallback(callback);
  const throttled = useMemo(() => createThrottledFn(onCall, delay), [delay, onCall]);
  useEffect(() => () => throttled.cancel(), [throttled]);
  return throttled;
}
