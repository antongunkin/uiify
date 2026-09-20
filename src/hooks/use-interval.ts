"use client";

import { useTimer } from "./use-timer.js";

/** Declarative `setInterval`. Pass `delay = null` to pause. */
export function useInterval(callback: () => void, delay: number | null): void {
  useTimer("interval", callback, delay);
}
