"use client";

import { useEffect } from "react";
import { useEventCallback } from "./use-event-callback.js";

/** Invokes `fn` once when the component unmounts. Always uses the latest `fn`. */
export function useUnmount(fn: () => void): void {
  const callback = useEventCallback(fn);
  useEffect(() => callback, [callback]);
}
