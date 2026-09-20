"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { useIsomorphicLayoutEffect } from "../../../hooks/use-isomorphic-layout-effect.js";
import { CarouselMarkup } from "../CarouselMarkup.js";
import type {
  CarouselAutoplaySnapshot,
  CarouselClientViewProps,
  CarouselSnapshot,
} from "../types.js";
import { attachCarouselFocus } from "./carousel-controls.js";

export const emptyCarouselSnapshot: CarouselSnapshot = {
  ready: false,
  index: 0,
  requestedIndex: null,
  settledChange: null,
  pages: [],
  visibleIndices: [],
  atStart: true,
  atEnd: true,
  moving: false,
  interacting: false,
};
const emptyAutoplaySnapshot: CarouselAutoplaySnapshot = {
  requested: false,
  playing: false,
  completedAdvances: 0,
};
export const getCarouselServerSnapshot = () => emptyCarouselSnapshot;
const getAutoplayServerSnapshot = () => emptyAutoplaySnapshot;
export const subscribeToNothing = () => () => {};

export function CarouselClientView({
  base,
  rootRef,
  mode,
  controller,
  autoplay,
}: CarouselClientViewProps): ReactElement | null {
  const snapshot = useSyncExternalStore(
    controller?.subscribe ?? subscribeToNothing,
    controller?.getSnapshot ?? getCarouselServerSnapshot,
    getCarouselServerSnapshot,
  );
  const rotation = useSyncExternalStore(
    autoplay?.subscribe ?? subscribeToNothing,
    autoplay?.getSnapshot ?? getAutoplayServerSnapshot,
    getAutoplayServerSnapshot,
  );
  // Start conservatively: the first ready render must not remove pre-hydration focus.
  const [preserveFallbackFocus, setPreserveFallbackFocus] = useState(true);
  useIsomorphicLayoutEffect(() => {
    const root = document.getElementById(base.id);
    if (!root) return;
    return attachCarouselFocus(root, setPreserveFallbackFocus);
  }, [base.id, base.items.length]);
  // Flips true only after the client's first commit — SSR and the first hydrated
  // render must stay identical, so pagination still claims no current slide until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Wrappers pass their complete client props as base; the pure renderer still accepts only server props.
  const rewind = "rewind" in base && base.rewind === true && snapshot.pages.length > 1;
  return (
    <CarouselMarkup
      base={base}
      rootRef={rootRef}
      presentation={{
        mode,
        snapshot: rewind ? { ...snapshot, atStart: false, atEnd: false } : snapshot,
        preserveFallbackFocus,
        mounted,
        ...(autoplay ? { autoplay: rotation } : {}),
      }}
    />
  );
}
CarouselClientView.displayName = "CarouselClientView";
