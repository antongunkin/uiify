import { attachCarouselCommands } from "../commands.js";
import type {
  CarouselController,
  CarouselControllerOptions,
  CarouselReason,
  CarouselSnapshot,
} from "../types.js";

/** One semantic page per slide; CSS owns the motion and its duration. */
export function createFadeController(
  root: HTMLElement,
  initialOptions: CarouselControllerOptions,
): CarouselController {
  const viewport = root.querySelector<HTMLElement>(":scope > [data-uiify-carousel-viewport]");
  if (!viewport) throw new Error("Carousel viewport is missing");
  const listeners = new Set<() => void>();
  let options = initialOptions;
  let slides: HTMLElement[] = [];
  let activeId: string | undefined;
  let destroyed = false;
  let token = 0;
  let frame = 0;
  let reconcile = false;
  let snapshot: CarouselSnapshot = {
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
  function publish(next: CarouselSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }
  function present(index: number) {
    for (const [i, slide] of slides.entries()) {
      slide.setAttribute("data-state", i === index ? "active" : "inactive");
      slide.toggleAttribute("inert", i !== index);
      if (i === index) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
    }
  }
  function request(index: number, reason: CarouselReason) {
    if (destroyed || snapshot.moving || !Number.isInteger(index) || index < 0 || !slides.length)
      return;
    const target = Math.min(index, slides.length - 1);
    if (
      target !== snapshot.index &&
      slides[snapshot.index]?.contains(root.ownerDocument.activeElement)
    )
      return;
    if (target === snapshot.index) {
      // A semantic no-op still releases an autoplay attempt at the finite boundary.
      publish({ ...snapshot, moving: true });
      publish({ ...snapshot, moving: false });
      return;
    }
    const detail = { previousIndex: snapshot.index, index: target, reason };
    const requestToken = ++token;
    options.beforeChange?.(detail);
    present(target);
    publish({ ...snapshot, requestedIndex: target, moving: true });
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (destroyed || requestToken !== token) return;
      const animations = [slides[detail.previousIndex], slides[target]].flatMap(
        (slide) =>
          slide
            ?.getAnimations()
            .filter(
              (animation) =>
                "transitionProperty" in animation &&
                (animation.effect as KeyframeEffect | null)?.target === slide,
            ) ?? [],
      );
      function settle() {
        if (destroyed || requestToken !== token) return;
        activeId = slides[target]?.id;
        publish({
          ...snapshot,
          index: target,
          requestedIndex: null,
          moving: false,
          visibleIndices: [target],
          atStart: target === 0,
          atEnd: target === slides.length - 1,
          settledChange: detail,
        });
        if (reason !== "controlled") options.onSelect?.(target, detail);
        options.afterChange?.(detail);
        if (reason === "drag") options.onSwipe?.(detail);
        if (reconcile) {
          reconcile = false;
          if (options.value !== undefined && options.value !== target)
            request(options.value, "controlled");
        }
      }
      if (animations.length)
        void Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
      else settle();
    });
  }
  function refresh() {
    if (destroyed) return;
    const next = Array.from(viewport!.children).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.hasAttribute("data-uiify-carousel-slide"),
    );
    if (
      snapshot.ready &&
      next.length === slides.length &&
      next.every((slide, i) => slide === slides[i])
    )
      return;
    ++token;
    cancelAnimationFrame(frame);
    slides = next;
    const focused = slides.findIndex((slide) => slide.contains(root.ownerDocument.activeElement));
    const retained = slides.findIndex((slide) => slide.id === activeId);
    const fragment = slides.findIndex(
      (slide) =>
        `#${encodeURIComponent(slide.id)}` === root.ownerDocument.defaultView?.location.hash,
    );
    const initial = options.value ?? (fragment >= 0 ? fragment : options.defaultValue);
    const target = Math.max(
      0,
      Math.min(
        slides.length - 1,
        focused >= 0
          ? focused
          : snapshot.ready
            ? retained >= 0
              ? retained
              : snapshot.index
            : initial,
      ),
    );
    present(target);
    activeId = slides[target]?.id;
    root.toggleAttribute("data-fade-ready", slides.length > 0);
    publish({
      ...snapshot,
      ready: slides.length > 0,
      index: target,
      requestedIndex: null,
      moving: false,
      pages: slides.map((_, index) => ({ index, offset: index })),
      visibleIndices: slides.length ? [target] : [],
      atStart: target === 0,
      atEnd: target === slides.length - 1,
    });
  }
  function step(direction: number, reason: CarouselReason) {
    let target = snapshot.index + direction;
    if (options.rewind && slides.length) target = (target + slides.length) % slides.length;
    request(Math.max(0, target), reason);
  }
  const detach = attachCarouselCommands(root, {
    next: () => step(1, "command"),
    previous: () => step(-1, "command"),
  });
  refresh();
  return {
    getSnapshot: () => snapshot,
    getGeometry: () => undefined,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    goTo: request,
    next: (reason) => step(1, reason),
    previous: (reason) => step(-1, reason),
    setInteracting(interacting) {
      if (!destroyed && interacting !== snapshot.interacting) publish({ ...snapshot, interacting });
    },
    update(next) {
      const changedValue = next.value !== options.value;
      options = next;
      if (snapshot.moving) {
        reconcile ||= changedValue;
        return;
      }
      if (next.value !== undefined && next.value !== snapshot.index)
        request(next.value, "controlled");
    },
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ++token;
      cancelAnimationFrame(frame);
      detach();
      listeners.clear();
      root.removeAttribute("data-fade-ready");
      for (const slide of slides) {
        slide.removeAttribute("inert");
        slide.removeAttribute("aria-hidden");
        slide.removeAttribute("data-state");
      }
    },
  };
}
