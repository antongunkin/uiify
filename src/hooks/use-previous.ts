"use client";

import { useEffect, useRef } from "react";

/** Returns the value `value` held during the previous render (`undefined` first). */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
