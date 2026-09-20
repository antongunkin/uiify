"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useEventCallback } from "./use-event-callback.js";
import { subscribeClickOutside } from "./utils/click-outside-subscription.js";

/** Calls `handler` on a `pointerdown` outside `ref` (capture phase). */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
): void {
  const onOutside = useEventCallback(handler);
  useEffect(() => {
    const listener = (event: Event) => {
      const node = ref.current;
      const target = event.target;
      if (!node || !(target instanceof Node) || node.contains(target)) return;
      onOutside(event);
    };
    return subscribeClickOutside(listener);
  }, [ref, onOutside]);
}
