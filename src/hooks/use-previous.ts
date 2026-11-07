"use client";

import { useState } from "react";

/** Returns the value `value` held before it last changed (`undefined` first). */
export function usePrevious<T>(value: T): T | undefined {
  const [history, setHistory] = useState<{ current: T; previous: T | undefined }>({
    current: value,
    previous: undefined,
  });
  if (!Object.is(history.current, value)) {
    setHistory({ current: value, previous: history.current });
    return history.current;
  }
  return history.previous;
}
