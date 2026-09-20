"use client";

import { useCallback, useEffect, useRef } from "react";

/** Returns a getter that reports whether the component is currently mounted. */
export function useIsMounted(): () => boolean {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return useCallback(() => mounted.current, []);
}
