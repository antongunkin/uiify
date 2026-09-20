"use client";

import { useSyncExternalStore } from "react";
import type { Dimensions } from "./utils/dimensions.js";

export type WindowSize = Dimensions;

const serverSnapshot: WindowSize = { width: 0, height: 0 };
let browserSnapshot = serverSnapshot;
const subscribers = new Set<() => void>();

function getSnapshot(): WindowSize {
  if (typeof window === "undefined") return serverSnapshot;

  const width = window.innerWidth;
  const height = window.innerHeight;
  if (browserSnapshot.width !== width || browserSnapshot.height !== height) {
    browserSnapshot = { width, height };
  }
  return browserSnapshot;
}

function notifySubscribers(): void {
  const previous = browserSnapshot;
  getSnapshot();
  if (browserSnapshot === previous) return;
  for (const subscriber of subscribers) subscriber();
}

function subscribe(subscriber: () => void): () => void {
  if (subscribers.size === 0 && typeof window !== "undefined") {
    window.addEventListener("resize", notifySubscribers);
  }
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("resize", notifySubscribers);
    }
  };
}

/** SSR-safe window dimensions; `{0,0}` on the server, measured after mount. */
export function useWindowSize(): WindowSize {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
