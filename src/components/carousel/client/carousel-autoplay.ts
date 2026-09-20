import type {
  CarouselAutoplayController,
  CarouselAutoplayOptions,
  CarouselAutoplaySnapshot,
  CarouselController,
} from "../types.js";

const defaultDelay = 5000;

function validate(options: CarouselAutoplayOptions) {
  const delay = options.delay ?? defaultDelay;
  if (!Number.isFinite(delay) || delay <= 0)
    throw new RangeError("Carousel autoplay delay must be a positive finite number");
  if (options.cycles !== undefined && (!Number.isInteger(options.cycles) || options.cycles < 0))
    throw new RangeError("Carousel autoplay cycles must be a nonnegative integer");
}

/** Schedule accessible rotation around semantic controller settlement, never pixel motion. */
export function createCarouselAutoplay(
  root: HTMLElement,
  controller: CarouselController,
  initialOptions: CarouselAutoplayOptions,
): CarouselAutoplayController {
  validate(initialOptions);
  const document = root.ownerDocument;
  const media = document.defaultView?.matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new Set<() => void>();
  let options = initialOptions;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;
  let hovered = false;
  let hidden = document.visibilityState === "hidden";
  const activePointers = new Set<number>();
  let touchActive = false;
  let explicitlyStopped = false;
  let focusStopped = belongsToRoot(document.activeElement);
  let reducedStopped = media?.matches === true;
  let exhausted = options.cycles === 0;
  let awaitingAdvance = false;
  let attemptedAtEnd = false;
  let pageCount = controller.getSnapshot().pages.length;
  let completedAdvances = 0;
  let lastSettledChange = controller.getSnapshot().settledChange;
  let previousMoving = controller.getSnapshot().moving;
  let snapshot: CarouselAutoplaySnapshot = {
    requested: !reducedStopped && !exhausted,
    playing: false,
    completedAdvances,
  };

  const requested = () => !explicitlyStopped && !focusStopped && !reducedStopped && !exhausted;

  function publish(playing = timeout !== undefined) {
    const next = { requested: requested(), playing, completedAdvances };
    if (
      next.requested === snapshot.requested &&
      next.playing === snapshot.playing &&
      next.completedAdvances === snapshot.completedAdvances
    )
      return;
    snapshot = next;
    listeners.forEach((listener) => listener());
  }

  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  }

  function eligible() {
    const state = controller.getSnapshot();
    return (
      requested() &&
      options.paused !== true &&
      !hovered &&
      !hidden &&
      activePointers.size === 0 &&
      !touchActive &&
      !awaitingAdvance &&
      state.ready &&
      state.pages.length > 1 &&
      !state.moving &&
      !state.interacting
    );
  }

  function schedule() {
    cancel();
    if (!destroyed && eligible()) {
      timeout = setTimeout(() => {
        timeout = undefined;
        const state = controller.getSnapshot();
        awaitingAdvance = true;
        attemptedAtEnd = state.atEnd;
        publish(false);
        controller.next("autoplay");
      }, options.delay ?? defaultDelay);
    }
    publish();
  }

  function stopPersistent(kind: "explicit" | "focus" | "reduced" | "exhausted") {
    if (kind === "explicit") explicitlyStopped = true;
    if (kind === "focus") focusStopped = true;
    if (kind === "reduced") reducedStopped = true;
    if (kind === "exhausted") exhausted = true;
    awaitingAdvance = false;
    schedule();
  }

  function belongsToRoot(target: EventTarget | null) {
    return target instanceof Element && target.closest("[data-uiify-carousel]") === root;
  }

  function userIntent(event: Event) {
    if (!belongsToRoot(event.target)) return;
    if (
      event.target instanceof Element &&
      event.target.closest('[data-carousel-action="rotation"]')
    )
      return;
    if (options.stopOnInteraction === true) stopPersistent("explicit");
    else schedule();
  }

  function pointerDown(event: PointerEvent) {
    if (!belongsToRoot(event.target)) return;
    activePointers.add(event.pointerId);
    userIntent(event);
  }

  function pointerEnd(event: PointerEvent) {
    if (!activePointers.delete(event.pointerId)) return;
    schedule();
  }

  function touchStart(event: TouchEvent) {
    if (!belongsToRoot(event.target)) return;
    touchActive = true;
    userIntent(event);
  }

  function touchEnd(event: TouchEvent) {
    if (!touchActive || event.touches.length > 0) return;
    touchActive = false;
    schedule();
  }

  function focusIn() {
    stopPersistent("focus");
  }

  function pointerOver(event: PointerEvent) {
    if (!belongsToRoot(event.target)) return;
    if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
    hovered = true;
    schedule();
  }

  function pointerOut(event: PointerEvent) {
    if (!belongsToRoot(event.target)) return;
    if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
    hovered = false;
    schedule();
  }

  function visibilityChange() {
    hidden = document.visibilityState === "hidden";
    schedule();
  }

  function reducedMotionChange(event: MediaQueryListEvent) {
    if (event.matches) stopPersistent("reduced");
  }

  function controllerChange() {
    const state = controller.getSnapshot();
    if (state.pages.length !== pageCount) {
      pageCount = state.pages.length;
      completedAdvances = 0;
      exhausted = options.cycles === 0;
      awaitingAdvance = false;
    }

    const settled = state.settledChange;
    const hasNewSettlement = settled !== null && settled !== lastSettledChange;
    if (hasNewSettlement) {
      lastSettledChange = settled;
      if (settled.reason === "autoplay") completedAdvances += 1;
      awaitingAdvance = false;
      attemptedAtEnd = false;
      const limit = options.cycles === undefined ? undefined : options.cycles * pageCount;
      if (limit !== undefined && completedAdvances >= limit) exhausted = true;
    } else if (awaitingAdvance && previousMoving && !state.moving) {
      awaitingAdvance = false;
      if (attemptedAtEnd) exhausted = true;
      attemptedAtEnd = false;
    }
    previousMoving = state.moving;
    schedule();
  }

  root.addEventListener("focusin", focusIn);
  root.addEventListener("pointerover", pointerOver);
  root.addEventListener("pointerout", pointerOut);
  root.addEventListener("pointerdown", pointerDown);
  root.addEventListener("keydown", userIntent);
  root.addEventListener("click", userIntent);
  root.addEventListener("wheel", userIntent, { passive: true });
  root.addEventListener("touchstart", touchStart, { passive: true });
  document.addEventListener("pointerup", pointerEnd);
  document.addEventListener("pointercancel", pointerEnd);
  document.addEventListener("touchend", touchEnd, { passive: true });
  document.addEventListener("touchcancel", touchEnd, { passive: true });
  document.addEventListener("visibilitychange", visibilityChange);
  media?.addEventListener("change", reducedMotionChange);
  const unsubscribe = controller.subscribe(controllerChange);
  schedule();

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start() {
      explicitlyStopped = false;
      focusStopped = false;
      reducedStopped = false;
      if (exhausted && options.cycles !== undefined) completedAdvances = 0;
      exhausted = options.cycles === 0;
      awaitingAdvance = false;
      schedule();
    },
    stop() {
      stopPersistent("explicit");
    },
    reset() {
      explicitlyStopped = false;
      focusStopped = false;
      exhausted = options.cycles === 0;
      awaitingAdvance = false;
      completedAdvances = 0;
      schedule();
    },
    update(next) {
      validate(next);
      const cycleChanged = next.cycles !== options.cycles;
      options = next;
      if (cycleChanged) {
        completedAdvances = 0;
        exhausted = next.cycles === 0;
      }
      schedule();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancel();
      unsubscribe();
      listeners.clear();
      root.removeEventListener("focusin", focusIn);
      root.removeEventListener("pointerover", pointerOver);
      root.removeEventListener("pointerout", pointerOut);
      root.removeEventListener("pointerdown", pointerDown);
      root.removeEventListener("keydown", userIntent);
      root.removeEventListener("click", userIntent);
      root.removeEventListener("wheel", userIntent);
      root.removeEventListener("touchstart", touchStart);
      document.removeEventListener("pointerup", pointerEnd);
      document.removeEventListener("pointercancel", pointerEnd);
      document.removeEventListener("touchend", touchEnd);
      document.removeEventListener("touchcancel", touchEnd);
      document.removeEventListener("visibilitychange", visibilityChange);
      media?.removeEventListener("change", reducedMotionChange);
      snapshot = { ...snapshot, playing: false };
    },
  };
}
