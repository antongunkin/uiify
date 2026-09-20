"use client";

import type { Ref, RefCallback } from "react";
import { useCallback } from "react";
import { assignRef } from "./utils/assign-ref.js";

/** Merges multiple refs (object or callback) into one stable callback ref. */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return useCallback((value: T | null) => {
    if (value === null) {
      for (const ref of refs) {
        assignRef(ref, null);
      }
      return;
    }

    const cleanups: Array<ReturnType<typeof assignRef>> = [];
    for (const ref of refs) {
      cleanups.push(assignRef(ref, value));
    }

    return () => {
      for (let index = 0; index < refs.length; index += 1) {
        const cleanup = cleanups[index];
        if (cleanup) {
          cleanup();
        } else {
          assignRef(refs[index], null);
        }
      }
    };
    // The dynamic ref list is intentionally the dependency list.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
