import type { CarouselObserver } from "../types.js";

/** Each measurement owns its observer, so old deliveries cannot mix with fresh geometry. */
export function observeCarousel(root: HTMLElement): CarouselObserver {
  const viewport = root.querySelector<HTMLElement>(':scope > [data-part="viewport"]');
  let current: IntersectionObserver | undefined;
  let live: IntersectionObserver | undefined;
  let receiveLive: ((index: number, visible: readonly number[]) => void) | undefined;
  let generation = 0;
  let liveGeneration = 0;
  let destroyed = false;
  function watchLive() {
    live?.disconnect();
    const liveToken = ++liveGeneration;
    if (!viewport || !receiveLive || destroyed) return;
    const slides = Array.from(viewport.children).filter(
      (node) => node.getAttribute("data-part") === "slide",
    );
    const ratios = new Map<Element, number>();
    live = new IntersectionObserver(
      (batch) => {
        if (destroyed || liveToken !== liveGeneration) return;
        for (const entry of batch)
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        const visible = slides.flatMap((slide, index) =>
          (ratios.get(slide) ?? 0) > 0 ? [index] : [],
        );
        let index = -1;
        let maximum = 0;
        slides.forEach((slide, candidate) => {
          const ratio = ratios.get(slide) ?? 0;
          if (ratio > maximum) {
            maximum = ratio;
            index = candidate;
          }
        });
        if (index >= 0) receiveLive?.(index, visible);
      },
      { root: viewport, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    slides.forEach((slide) => live!.observe(slide));
  }
  return {
    watch(receive) {
      receiveLive = receive;
      watchLive();
    },
    measure(receive) {
      watchLive();
      current?.disconnect();
      const token = ++generation;
      if (destroyed || !viewport) return;
      const slides = Array.from(viewport.children).filter(
        (node) => node.getAttribute("data-part") === "slide",
      );
      if (!slides.length) return;
      const entries = new Map<Element, IntersectionObserverEntry>();
      current = new IntersectionObserver(
        (batch) => {
          if (destroyed || token !== generation) return;
          for (const entry of batch)
            if (slides.includes(entry.target)) entries.set(entry.target, entry);
          if (entries.size !== slides.length) return;
          const ordered = slides.map((slide) => entries.get(slide)!);
          const first = ordered[0]!;
          const bounds = first.rootBounds;
          const a = first.boundingClientRect;
          const b = ordered[1]?.boundingClientRect;
          const physicalAxis = b && Math.abs(b.y - a.y) > Math.abs(b.x - a.x) ? "y" : "x";
          const vertical = physicalAxis === "y";
          const sign = b && (vertical ? b.y - a.y : b.x - a.x) < 0 ? -1 : 1;
          const size = (rect: DOMRectReadOnly) => (vertical ? rect.height : rect.width);
          const edge = (rect: DOMRectReadOnly) =>
            sign === 1 ? (vertical ? rect.top : rect.left) : vertical ? rect.bottom : rect.right;
          if (
            !bounds ||
            size(bounds) <= 0 ||
            ordered.some((entry) => size(entry.boundingClientRect) <= 0)
          )
            return;
          const itemStarts = ordered.map((entry) =>
            Math.max(0, sign * (edge(entry.boundingClientRect) - edge(a))),
          );
          const itemSizes = ordered.map((entry) => size(entry.boundingClientRect));
          const maximum = Math.max(0, itemStarts.at(-1)! + itemSizes.at(-1)! - size(bounds));
          current?.disconnect();
          generation++;
          receive({
            geometry: {
              physicalAxis,
              sign,
              viewportSize: size(bounds),
              currentOffset: Math.min(maximum, Math.max(0, sign * (edge(bounds) - edge(a)))),
              itemStarts,
              itemSizes,
            },
            visibleIndices: ordered.flatMap((entry, index) =>
              entry.isIntersecting && entry.intersectionRatio > 0 ? [index] : [],
            ),
          });
        },
        { root: viewport },
      );
      slides.forEach((slide) => current!.observe(slide));
    },
    destroy() {
      destroyed = true;
      generation++;
      current?.disconnect();
      live?.disconnect();
    },
  };
}
