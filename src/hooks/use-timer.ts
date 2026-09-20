"use client";

import { useEffect } from "react";
import { useEventCallback } from "./use-event-callback.js";

type TimerKind = "timeout" | "interval";

function scheduleTimer(kind: TimerKind, callback: () => void, delay: number): () => void {
  if (kind === "timeout") {
    const id = setTimeout(callback, delay);
    return () => clearTimeout(id);
  }
  const id = setInterval(callback, delay);
  return () => clearInterval(id);
}

/** Shared implementation for declarative timeout/interval hooks. */
export function useTimer(kind: TimerKind, callback: () => void, delay: number | null): void {
  const onTick = useEventCallback(callback);
  useEffect(() => {
    if (delay === null) return;
    return scheduleTimer(kind, () => onTick(), delay);
  }, [delay, kind, onTick]);
}
