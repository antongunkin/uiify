import { createCarouselPages, findCarouselPage } from "../carousel-pages.js";
import { attachCarouselCommands } from "../commands.js";
import type {
  CarouselController,
  CarouselControllerOptions,
  CarouselGeometry,
  CarouselObservation,
  CarouselReason,
  CarouselSnapshot,
} from "../types.js";
import { observeCarousel } from "./carousel-observer.js";

export function createCarouselController(
  root: HTMLElement,
  initialOptions: CarouselControllerOptions,
): CarouselController {
  const viewport = root.querySelector<HTMLElement>(":scope > [data-uiify-carousel-viewport]");
  if (!viewport) throw new Error("Carousel viewport is missing");
  const observer = observeCarousel(root);
  const listeners = new Set<() => void>();
  let options = initialOptions;
  let geometry: CarouselGeometry | undefined;
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
  let destroyed = false;
  let token = 0;
  let reason: CarouselReason = "scroll";
  let silent = false;
  let activeId: string | undefined;
  let touch = false;
  let touchActive = false;
  const resizedSlides = new Set<Element>();
  const slides = () =>
    Array.from(viewport.children).filter((node) => node.hasAttribute("data-uiify-carousel-slide"));
  function publish(next: CarouselSnapshot) {
    if (JSON.stringify(snapshot) === JSON.stringify(next)) return;
    snapshot = next;
    listeners.forEach((listener) => listener());
  }
  function observe(value: CarouselObservation, settle: boolean) {
    if (value.geometry.viewportSize <= 0) return;
    geometry = value.geometry;
    const pages = createCarouselPages(geometry);
    const page = findCarouselPage(pages, geometry.currentOffset);
    if (!page || geometry.viewportSize <= 0) return;
    const previousIndex = snapshot.index;
    const changed = snapshot.ready && previousIndex !== page.index;
    const detail =
      changed && settle && !silent ? { previousIndex, index: page.index, reason } : null;
    publish({
      ...snapshot,
      ready: true,
      pages,
      visibleIndices: value.visibleIndices,
      index: settle ? page.index : snapshot.index,
      atStart: page.index === pages[0]?.index,
      atEnd: page.index === pages.at(-1)?.index,
      ...(settle
        ? { moving: false, requestedIndex: null, settledChange: detail ?? snapshot.settledChange }
        : {}),
    });
    if (settle) {
      activeId = slides()[page.index]?.id;
      if (detail) {
        if (reason !== "controlled") options.onSelect?.(page.index, detail);
        options.afterChange?.(detail);
        if (reason === "drag" || touch) options.onSwipe?.(detail);
      }
      touch = false;
      silent = false;
      reason = "scroll";
    }
  }
  function measure(receive: (value: CarouselObservation) => void) {
    const request = ++token;
    observer.measure((value) => {
      if (!destroyed && request === token) receive(value);
    });
  }
  function request(index: number, why: CarouselReason, quiet = false) {
    if (destroyed || !Number.isInteger(index) || index < 0) return;
    const previousRequested = snapshot.requestedIndex;
    touch = false;
    touchActive = false;
    reason = why;
    silent = quiet;
    publish({ ...snapshot, requestedIndex: index, moving: true });
    measure((value) => {
      observe(value, false);
      const target =
        snapshot.pages.filter((page) => page.index <= index).at(-1) ?? snapshot.pages[0];
      if (!target) return;
      const delta = target.offset - value.geometry.currentOffset;
      if (Math.abs(delta) <= 1) {
        observe(value, true);
        return;
      }
      publish({ ...snapshot, requestedIndex: target.index });
      if (!quiet && previousRequested !== target.index)
        options.beforeChange?.({ previousIndex: snapshot.index, index: target.index, reason: why });
      viewport!.scrollBy(
        value.geometry.physicalAxis === "x"
          ? { left: delta * value.geometry.sign, behavior: "auto" }
          : { top: delta * value.geometry.sign, behavior: "auto" },
      );
    });
  }
  function step(direction: 1 | -1, why: CarouselReason) {
    const pages = snapshot.pages;
    const position = pages.findIndex(
      (page) => page.index === (snapshot.requestedIndex ?? snapshot.index),
    );
    let next = position + direction;
    if (options.rewind) next = (next + pages.length) % pages.length;
    const target = pages[Math.max(0, Math.min(pages.length - 1, next))];
    if (target) request(target.index, why);
  }
  function refresh() {
    if (destroyed) return;
    const currentSlides = slides();
    for (const slide of resizedSlides) {
      if (!currentSlides.includes(slide)) {
        resize.unobserve(slide);
        resizedSlides.delete(slide);
      }
    }
    for (const slide of currentSlides) {
      if (!resizedSlides.has(slide)) {
        resizedSlides.add(slide);
        resize.observe(slide);
      }
    }
    const wasReady = snapshot.ready;
    const oldId = activeId;
    measure((value) => {
      if (!wasReady) silent = true;
      observe(value, false);
      if (!snapshot.ready) return;
      const retained = oldId ? slides().findIndex((node) => node.id === oldId) : -1;
      const target =
        options.value ??
        (wasReady ? Math.max(0, retained < 0 ? snapshot.index : retained) : options.defaultValue);
      const hasFragment = slides().some(
        (node) =>
          `#${encodeURIComponent(node.id)}` === root.ownerDocument.defaultView?.location.hash,
      );
      if (
        (!wasReady &&
          options.value === undefined &&
          (value.geometry.currentOffset > 1 || hasFragment)) ||
        target === findCarouselPage(snapshot.pages, value.geometry.currentOffset)?.index
      )
        observe(value, true);
      else request(target, wasReady ? "items" : "controlled", !wasReady);
    });
  }
  const scroll = () => {
    if (touchActive) touch = true;
    if (!snapshot.moving) publish({ ...snapshot, moving: true });
  };
  // Native touch events continue after pointercancel when the browser takes over scrolling.
  const touchStart = (event: TouchEvent) => {
    if (event.target instanceof Element && event.target.closest("[data-uiify-carousel]") === root) {
      touchActive = true;
      touch = false;
    }
  };
  const touchEnd = () => {
    touchActive = false;
  };
  const settle = () => {
    measure((value) => observe(value, true));
  };
  const pointer = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest("[data-uiify-carousel]") !== root)
      return;
    if (snapshot.moving) {
      ++token;
      reason = "scroll";
      silent = false;
      publish({ ...snapshot, requestedIndex: null });
    }
  };
  viewport.addEventListener("scroll", scroll);
  viewport.addEventListener("scrollend", settle);
  viewport.addEventListener("pointerdown", pointer);
  viewport.addEventListener("touchstart", touchStart, { passive: true });
  viewport.addEventListener("touchend", touchEnd, { passive: true });
  viewport.addEventListener("touchcancel", touchEnd, { passive: true });
  const resize = new ResizeObserver(refresh);
  resize.observe(viewport);
  const controller: CarouselController = {
    getSnapshot: () => snapshot,
    getGeometry: () => geometry,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    goTo: request,
    next: (why) => step(1, why),
    previous: (why) => step(-1, why),
    setInteracting(active) {
      if (destroyed) return;
      publish({ ...snapshot, interacting: active });
    },
    update(next) {
      options = next;
      if (snapshot.ready && next.value !== undefined && next.value !== snapshot.index)
        request(next.value, "controlled");
    },
    refresh,
    destroy() {
      destroyed = true;
      token++;
      observer.destroy();
      resize.disconnect();
      detach();
      listeners.clear();
      viewport.removeEventListener("scroll", scroll);
      viewport.removeEventListener("scrollend", settle);
      viewport.removeEventListener("pointerdown", pointer);
      viewport.removeEventListener("touchstart", touchStart);
      viewport.removeEventListener("touchend", touchEnd);
      viewport.removeEventListener("touchcancel", touchEnd);
    },
  };
  const detach = attachCarouselCommands(root, {
    next: () => controller.next("command"),
    previous: () => controller.previous("command"),
  });
  refresh();
  return controller;
}
