"use client";

import { useTimer } from "./use-timer.js";

/** Declarative `setTimeout`. Pass `delay = null` to pause. */
export function useTimeout(callback: () => void, delay: number | null): void {
  useTimer("timeout", callback, delay);
}
