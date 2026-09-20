import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CarouselController, CarouselReason, CarouselSnapshot } from "../types.js";
import { emptyCarouselSnapshot } from "./CarouselClientView.js";
import { createCarouselAutoplay } from "./carousel-autoplay.js";

interface ControllerFixture {
  readonly controller: CarouselController;
  readonly next: ReturnType<typeof vi.fn>;
  readonly publish: (patch: Partial<CarouselSnapshot>) => void;
  readonly settle: (index: number, reason?: CarouselReason) => void;
}

function controllerFixture(pageCount = 3): ControllerFixture {
  const listeners = new Set<() => void>();
  const pages = Array.from({ length: pageCount }, (_, index) => ({ index, offset: index * 100 }));
  let snapshot: CarouselSnapshot = {
    ...emptyCarouselSnapshot,
    ready: true,
    pages,
    visibleIndices: pageCount ? [0] : [],
    atEnd: pageCount <= 1,
  };
  const next = vi.fn();
  return {
    controller: {
      getSnapshot: () => snapshot,
      getGeometry: () => undefined,
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      goTo: vi.fn(),
      next,
      previous: vi.fn(),
      setInteracting: vi.fn(),
      update: vi.fn(),
      refresh: vi.fn(),
      destroy: vi.fn(),
    },
    next,
    publish(patch) {
      snapshot = { ...snapshot, ...patch };
      listeners.forEach((listener) => listener());
    },
    settle(index, reason = "autoplay") {
      const previousIndex = snapshot.index;
      snapshot = {
        ...snapshot,
        index,
        moving: false,
        requestedIndex: null,
        atStart: index === pages[0]?.index,
        atEnd: index === pages.at(-1)?.index,
        settledChange: { previousIndex, index, reason },
      };
      listeners.forEach((listener) => listener());
    },
  };
}

interface MediaFixture {
  readonly setReduced: (matches: boolean) => void;
}

function mediaFixture(initial = false): MediaFixture {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  let matches = initial;
  vi.stubGlobal("matchMedia", (_query: string) => ({
    get matches() {
      return matches;
    },
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_type: "change", listener: (event: MediaQueryListEvent) => void) =>
      listeners.add(listener),
    removeEventListener: (_type: "change", listener: (event: MediaQueryListEvent) => void) =>
      listeners.delete(listener),
    dispatchEvent: () => true,
    addListener: () => {},
    removeListener: () => {},
  }));
  return {
    setReduced(next) {
      matches = next;
      const event = { matches: next } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function rootFixture() {
  document.body.innerHTML = `<section data-uiify-carousel><button data-carousel-action="rotation">Rotation</button><div data-uiify-carousel-viewport tabindex="0"></div><button data-carousel-action="next">Next</button><section data-uiify-carousel><button>Nested</button></section></section>`;
  return document.querySelector<HTMLElement>("section")!;
}

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, value: state });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  vi.useFakeTimers();
  mediaFixture();
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("carousel autoplay", () => {
  it("starts persistently stopped when content already owns focus before attachment", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const focused = root.querySelector<HTMLButtonElement>('[data-carousel-action="next"]')!;
    focused.focus();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    expect(autoplay.getSnapshot()).toMatchObject({ requested: false, playing: false });
    vi.advanceTimersByTime(5000);
    expect(fixture.next).not.toHaveBeenCalled();
    focused.blur();
    vi.advanceTimersByTime(5000);
    expect(fixture.next).not.toHaveBeenCalled();

    autoplay.start();
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("advances once after a full delay and waits for settlement before scheduling again", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 5000 });

    expect(autoplay.getSnapshot()).toEqual({
      requested: true,
      playing: true,
      completedAdvances: 0,
    });
    vi.advanceTimersByTime(5000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    expect(autoplay.getSnapshot().playing).toBe(false);
    vi.advanceTimersByTime(15000);
    expect(fixture.next).toHaveBeenCalledTimes(1);

    fixture.settle(1);
    expect(autoplay.getSnapshot()).toEqual({
      requested: true,
      playing: true,
      completedAdvances: 1,
    });
    vi.advanceTimersByTime(4999);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledTimes(2);
    autoplay.destroy();
  });

  it("makes focus entry a persistent stop until explicit Start", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 5000 });

    root
      .querySelector<HTMLElement>("[data-uiify-carousel-viewport]")!
      .dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    root.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    vi.advanceTimersByTime(15000);
    expect(fixture.next).not.toHaveBeenCalled();
    expect(autoplay.getSnapshot().requested).toBe(false);

    autoplay.start();
    vi.advanceTimersByTime(5000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("persistently stops the ancestor when focus enters a nested carousel", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    root
      .querySelector(":scope > section button")!
      .dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    vi.advanceTimersByTime(3000);
    expect(fixture.next).not.toHaveBeenCalled();
    expect(autoplay.getSnapshot()).toMatchObject({ requested: false, playing: false });
    autoplay.destroy();
  });

  it("temporarily pauses on hover and resumes with a fresh delay after pointer leave", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    root.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(3000);
    expect(fixture.next).not.toHaveBeenCalled();
    expect(autoplay.getSnapshot()).toMatchObject({ requested: true, playing: false });
    root.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    vi.advanceTimersByTime(999);
    expect(fixture.next).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("keeps pointer-activated Start paused until the pointer leaves", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    autoplay.stop();
    root.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    autoplay.start();
    expect(autoplay.getSnapshot()).toMatchObject({ requested: true, playing: false });
    root.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("does not schedule while pointer or touch input remains active", () => {
    for (const [startType, endType] of [
      ["pointerdown", "pointerup"],
      ["pointerdown", "pointercancel"],
      ["touchstart", "touchend"],
      ["touchstart", "touchcancel"],
    ] as const) {
      const root = rootFixture();
      const fixture = controllerFixture();
      const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });
      const viewport = root.querySelector("[data-uiify-carousel-viewport]")!;

      viewport.dispatchEvent(
        startType === "pointerdown"
          ? new PointerEvent(startType, { bubbles: true, pointerId: 7 })
          : new TouchEvent(startType, { bubbles: true }),
      );
      vi.advanceTimersByTime(3000);
      expect(fixture.next).not.toHaveBeenCalled();

      document.dispatchEvent(
        endType.startsWith("pointer")
          ? new PointerEvent(endType, { bubbles: true, pointerId: 7 })
          : new TouchEvent(endType, { bubbles: true }),
      );
      vi.advanceTimersByTime(999);
      expect(fixture.next).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
      autoplay.destroy();
    }
  });

  it("keeps active pointer and touch holds paused across semantic settlement", () => {
    for (const [startType, endType] of [
      ["pointerdown", "pointerup"],
      ["touchstart", "touchend"],
    ] as const) {
      const root = rootFixture();
      const fixture = controllerFixture();
      const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });
      const viewport = root.querySelector("[data-uiify-carousel-viewport]")!;

      viewport.dispatchEvent(
        startType === "pointerdown"
          ? new PointerEvent(startType, { bubbles: true, pointerId: 11 })
          : new TouchEvent(startType, { bubbles: true }),
      );
      fixture.settle(1, "scroll");
      vi.advanceTimersByTime(3000);
      expect(fixture.next).not.toHaveBeenCalled();

      document.dispatchEvent(
        endType === "pointerup"
          ? new PointerEvent(endType, { bubbles: true, pointerId: 11 })
          : new TouchEvent(endType, { bubbles: true }),
      );
      vi.advanceTimersByTime(1000);
      expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
      autoplay.destroy();
    }
  });

  it("temporarily pauses while hidden and restarts a full delay when visible", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 2000 });

    vi.advanceTimersByTime(1500);
    setVisibility("hidden");
    vi.advanceTimersByTime(5000);
    expect(fixture.next).not.toHaveBeenCalled();
    setVisibility("visible");
    vi.advanceTimersByTime(1999);
    expect(fixture.next).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("stops persistently for reduced motion on load and change while Start opts in", () => {
    vi.unstubAllGlobals();
    const media = mediaFixture(true);
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    vi.advanceTimersByTime(3000);
    expect(fixture.next).not.toHaveBeenCalled();
    expect(autoplay.getSnapshot().requested).toBe(false);
    autoplay.start();
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    fixture.settle(1);
    media.setReduced(false);
    media.setReduced(true);
    vi.advanceTimersByTime(3000);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    expect(autoplay.getSnapshot().requested).toBe(false);
    autoplay.destroy();
  });

  it("honors explicit Stop, Reset, and consumer-controlled paused updates independently", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    autoplay.stop();
    autoplay.update({ delay: 1000, paused: false });
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();
    autoplay.reset();
    autoplay.update({ delay: 1000, paused: true });
    expect(autoplay.getSnapshot()).toMatchObject({ requested: true, playing: false });
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();
    autoplay.update({ delay: 1000, paused: false });
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    autoplay.destroy();
  });

  it("pauses for motion and dragging, then starts a full delay after settlement", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    fixture.publish({ moving: true });
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();
    fixture.publish({ moving: false, interacting: true });
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();
    fixture.publish({ interacting: false });
    vi.advanceTimersByTime(999);
    expect(fixture.next).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    autoplay.destroy();
  });

  it("cancels for wheel without cancelling the event and resumes after settlement", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });
    const wheel = new WheelEvent("wheel", { bubbles: true, cancelable: true });

    root.querySelector("[data-uiify-carousel-viewport]")!.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
    fixture.publish({ moving: true });
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();
    fixture.settle(1, "scroll");
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    autoplay.destroy();
  });

  it("stops on user intent when stopOnInteraction is enabled", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, {
      delay: 1000,
      stopOnInteraction: true,
    });

    root
      .querySelector("[data-carousel-action=next]")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fixture.settle(1, "next");
    vi.advanceTimersByTime(3000);
    expect(fixture.next).not.toHaveBeenCalled();
    expect(autoplay.getSnapshot().requested).toBe(false);
    autoplay.destroy();
  });

  it("leaves the rotation control to the explicit start/stop command", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, {
      delay: 1000,
      stopOnInteraction: true,
    });

    root
      .querySelector("[data-carousel-action=rotation]")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(autoplay.getSnapshot().requested).toBe(true);
    autoplay.destroy();
  });

  it("counts only distinct successful autoplay settlements and enforces cycle budgets", () => {
    const root = rootFixture();
    const fixture = controllerFixture(2);
    const autoplay = createCarouselAutoplay(root, fixture.controller, {
      delay: 1000,
      cycles: 1,
    });

    vi.advanceTimersByTime(1000);
    fixture.settle(1, "scroll");
    expect(autoplay.getSnapshot().completedAdvances).toBe(0);
    vi.advanceTimersByTime(1000);
    fixture.settle(0);
    const repeated = fixture.controller.getSnapshot().settledChange;
    fixture.publish({ settledChange: repeated });
    expect(autoplay.getSnapshot().completedAdvances).toBe(1);
    vi.advanceTimersByTime(1000);
    fixture.settle(1);
    expect(autoplay.getSnapshot()).toEqual({
      requested: false,
      playing: false,
      completedAdvances: 2,
    });
    vi.advanceTimersByTime(5000);
    expect(fixture.next).toHaveBeenCalledTimes(3);
    autoplay.destroy();
  });

  it("resets the cycle count and delay when the page count changes", () => {
    const root = rootFixture();
    const fixture = controllerFixture(2);
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000, cycles: 1 });

    vi.advanceTimersByTime(1000);
    fixture.settle(1);
    expect(autoplay.getSnapshot().completedAdvances).toBe(1);
    vi.advanceTimersByTime(500);
    fixture.publish({
      pages: [...fixture.controller.getSnapshot().pages, { index: 2, offset: 200 }],
    });
    expect(autoplay.getSnapshot().completedAdvances).toBe(0);
    vi.advanceTimersByTime(999);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledTimes(2);
    autoplay.destroy();
  });

  it("does not schedule for zero/one page or cycles=0 and stops after a finite-end no-op", () => {
    const root = rootFixture();
    const empty = controllerFixture(0);
    const emptyAutoplay = createCarouselAutoplay(root, empty.controller, { delay: 1000 });
    expect(emptyAutoplay.getSnapshot().playing).toBe(false);
    emptyAutoplay.destroy();

    const one = controllerFixture(1);
    const oneAutoplay = createCarouselAutoplay(root, one.controller, { delay: 1000 });
    expect(oneAutoplay.getSnapshot().playing).toBe(false);
    oneAutoplay.destroy();

    const zeroCycles = controllerFixture(2);
    const zeroCyclesAutoplay = createCarouselAutoplay(root, zeroCycles.controller, {
      delay: 1000,
      cycles: 0,
    });
    expect(zeroCyclesAutoplay.getSnapshot()).toMatchObject({ requested: false, playing: false });
    zeroCyclesAutoplay.start();
    vi.advanceTimersByTime(5000);
    expect(zeroCycles.next).not.toHaveBeenCalled();
    zeroCyclesAutoplay.destroy();

    const finite = controllerFixture(2);
    finite.publish({ index: 1, atStart: false, atEnd: true });
    const finiteAutoplay = createCarouselAutoplay(root, finite.controller, { delay: 1000 });
    vi.advanceTimersByTime(1000);
    expect(finite.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    finite.publish({ moving: true });
    finite.publish({ moving: false });
    expect(finiteAutoplay.getSnapshot()).toMatchObject({ requested: false, playing: false });
    finiteAutoplay.destroy();
  });

  it("restarts a full delay when delay changes and rejects malformed options", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const autoplay = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });

    vi.advanceTimersByTime(750);
    autoplay.update({ delay: 2000 });
    vi.advanceTimersByTime(1999);
    expect(fixture.next).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fixture.next).toHaveBeenCalledTimes(1);
    autoplay.destroy();

    expect(() => createCarouselAutoplay(root, fixture.controller, { delay: 0 })).toThrow(
      /positive finite/,
    );
    expect(() => createCarouselAutoplay(root, fixture.controller, { cycles: 1.5 })).toThrow(
      /nonnegative integer/,
    );
  });

  it("cleans up timers, subscriptions and environment listeners across remounts", () => {
    const root = rootFixture();
    const fixture = controllerFixture();
    const first = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });
    first.destroy();
    root.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    setVisibility("hidden");
    setVisibility("visible");
    vi.advanceTimersByTime(2000);
    expect(fixture.next).not.toHaveBeenCalled();

    const second = createCarouselAutoplay(root, fixture.controller, { delay: 1000 });
    vi.advanceTimersByTime(1000);
    expect(fixture.next).toHaveBeenCalledExactlyOnceWith("autoplay");
    second.destroy();
    vi.advanceTimersByTime(5000);
    expect(fixture.next).toHaveBeenCalledTimes(1);
  });
});
