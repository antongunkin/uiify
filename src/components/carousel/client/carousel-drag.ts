import { createCarouselPages, findCarouselPage } from "../carousel-pages.js";
import type { CarouselController, CarouselGeometry } from "../types.js";

const DRAG_THRESHOLD = 5;
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='button']",
  "[role='link']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='slider']",
  "[role='textbox']",
].join(",");

interface DragState {
  readonly pointerId: number;
  readonly geometry: CarouselGeometry;
  readonly start: number;
  readonly maximumOffset: number;
  last: number;
  offset: number;
  dragging: boolean;
}

function coordinate(event: PointerEvent, geometry: CarouselGeometry): number {
  return geometry.physicalAxis === "x" ? event.clientX : event.clientY;
}

function ownsEvent(root: HTMLElement, target: EventTarget | null): target is Element {
  return target instanceof Element && target.closest("[data-uiify-carousel]") === root;
}

/** Adds optional mouse dragging without intercepting touch, pen, wheel, or pre-intent selection. */
export function attachCarouselDrag(root: HTMLElement, controller: CarouselController): () => void {
  const candidate = root.querySelector<HTMLElement>(":scope > [data-uiify-carousel-viewport]");
  if (!candidate) return () => {};
  const viewport = candidate;

  let state: DragState | undefined;
  let cancelClick = false;

  function restore(): void {
    viewport.removeAttribute("data-dragging");
    controller.setInteracting(false);
  }

  function settle(drag: DragState): void {
    controller.refresh();
    const refreshed = controller.getGeometry();
    const geometry =
      refreshed && refreshed !== drag.geometry
        ? refreshed
        : { ...drag.geometry, currentOffset: drag.offset };
    const page = findCarouselPage(createCarouselPages(geometry), geometry.currentOffset);
    if (page) controller.goTo(page.index, "drag");
  }

  function finish(pointerId: number, shouldSettle: boolean, suppressClick: boolean): void {
    const current = state;
    if (!current || current.pointerId !== pointerId) return;
    state = undefined;
    if (!current.dragging) return;
    cancelClick = suppressClick;
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    restore();
    if (shouldSettle) settle(current);
  }

  function pointerDown(event: PointerEvent): void {
    if (
      event.defaultPrevented ||
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !ownsEvent(root, event.target) ||
      event.target.closest(INTERACTIVE_SELECTOR)
    )
      return;
    const geometry = controller.getGeometry();
    if (!geometry) return;
    const pages = createCarouselPages(geometry);
    const start = coordinate(event, geometry);
    state = {
      pointerId: event.pointerId,
      geometry,
      start,
      maximumOffset: pages.at(-1)?.offset ?? 0,
      last: start,
      offset: geometry.currentOffset,
      dragging: false,
    };
  }

  function pointerMove(event: PointerEvent): void {
    const current = state;
    if (!current || current.pointerId !== event.pointerId) return;
    if (!current.dragging && (event.buttons & 1) === 0) {
      state = undefined;
      return;
    }
    const next = coordinate(event, current.geometry);
    if (!current.dragging) {
      if (Math.abs(next - current.start) < DRAG_THRESHOLD) return;
      current.dragging = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.setAttribute("data-dragging", "");
      controller.setInteracting(true);
    }
    event.preventDefault();
    const physicalMovement = next - current.last;
    const normalizedMovement = physicalMovement * current.geometry.sign;
    const normalizedScrollDelta = -normalizedMovement;
    const physicalScrollDelta = normalizedScrollDelta * current.geometry.sign;
    current.offset = Math.max(
      0,
      Math.min(current.maximumOffset, current.offset + normalizedScrollDelta),
    );
    current.last = next;
    viewport.scrollBy(
      current.geometry.physicalAxis === "x"
        ? { left: physicalScrollDelta, behavior: "auto" }
        : { top: physicalScrollDelta, behavior: "auto" },
    );
  }

  function pointerUp(event: PointerEvent): void {
    finish(event.pointerId, true, true);
  }

  function pointerCancel(event: PointerEvent): void {
    finish(event.pointerId, true, false);
  }

  function lostPointerCapture(event: PointerEvent): void {
    finish(event.pointerId, true, false);
  }

  function click(event: MouseEvent): void {
    if (!cancelClick || !ownsEvent(root, event.target)) return;
    cancelClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  viewport.addEventListener("pointerdown", pointerDown);
  viewport.addEventListener("pointermove", pointerMove);
  viewport.addEventListener("pointerup", pointerUp);
  viewport.addEventListener("pointercancel", pointerCancel);
  viewport.addEventListener("lostpointercapture", lostPointerCapture);
  root.addEventListener("click", click, true);

  return () => {
    const current = state;
    state = undefined;
    cancelClick = false;
    if (current?.dragging) {
      if (viewport.hasPointerCapture(current.pointerId))
        viewport.releasePointerCapture(current.pointerId);
      restore();
    }
    viewport.removeEventListener("pointerdown", pointerDown);
    viewport.removeEventListener("pointermove", pointerMove);
    viewport.removeEventListener("pointerup", pointerUp);
    viewport.removeEventListener("pointercancel", pointerCancel);
    viewport.removeEventListener("lostpointercapture", lostPointerCapture);
    root.removeEventListener("click", click, true);
  };
}
