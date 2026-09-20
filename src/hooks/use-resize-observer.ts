"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useRefElement } from "./use-ref-element.js";
import type { Dimensions } from "./utils/dimensions.js";

export type Size = Dimensions;

/** Observes `ref`'s content box; returns its size (`undefined` until measured). */
export function useResizeObserver<T extends Element>(ref: RefObject<T | null>): Size | undefined {
  const element = useRefElement(ref);
  const [size, setSize] = useState<Size | undefined>(undefined);

  useEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((current) =>
        current?.width === width && current.height === height ? current : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return size;
}
