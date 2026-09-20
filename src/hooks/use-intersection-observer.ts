"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { useRefElement } from "./use-ref-element.js";
import { intersectionEntryChanged, serializeThreshold } from "./utils/intersection.js";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Once intersecting, stop observing and keep the last entry. */
  freezeOnceVisible?: boolean;
}

/** Observes `ref`; returns the latest `IntersectionObserverEntry`. */
export function useIntersectionObserver<T extends Element>(
  ref: RefObject<T | null>,
  options: UseIntersectionObserverOptions = {},
): IntersectionObserverEntry | undefined {
  const element = useRefElement(ref);
  const { freezeOnceVisible = false, root, rootMargin, threshold } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);
  const frozen = Boolean(entry?.isIntersecting) && freezeOnceVisible;
  const thresholdKey = serializeThreshold(threshold);

  useEffect(() => {
    if (!element || frozen || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const next = entries[0];
        if (!next) return;
        setEntry((previous) => (intersectionEntryChanged(previous, next) ? next : previous));
      },
      {
        root: root ?? null,
        rootMargin: rootMargin ?? "0px",
        threshold: threshold ?? 0,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
    // thresholdKey stands in for the (possibly array) threshold value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, root, rootMargin, thresholdKey, frozen]);

  return entry;
}
