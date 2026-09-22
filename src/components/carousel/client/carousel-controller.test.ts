import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CarouselObservation } from "../types.js";
import { createCarouselController } from "./carousel-controller.js";

const observations = vi.hoisted(() => ({
  receive: undefined as ((value: CarouselObservation) => void) | undefined,
}));
vi.mock("./carousel-observer.js", () => ({
  observeCarousel: () => ({
    measure: (receive: (value: CarouselObservation) => void) => {
      observations.receive = receive;
    },
    destroy: vi.fn(),
  }),
}));

function deliver(offset: number, count = 3): void {
  observations.receive?.({
    geometry: {
      physicalAxis: "x",
      sign: 1,
      viewportSize: 640,
      currentOffset: offset,
      itemStarts: Array.from({ length: count }, (_, i) => i * 640),
      itemSizes: Array.from({ length: count }, () => 640),
    },
    visibleIndices: [Math.round(offset / 640)],
  });
}
function fixture() {
  document.body.innerHTML =
    '<section data-uiify-carousel><div data-part="viewport"><div id="a" data-part="slide"></div><div id="b" data-part="slide"></div><div id="c" data-part="slide"></div></div></section>';
  const root = document.querySelector<HTMLElement>("section")!;
  const viewport = root.firstElementChild as HTMLElement;
  viewport.scrollBy = vi.fn();
  return { root, viewport };
}
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("native carousel controller", () => {
  it("waits for visible geometry and applies default selection silently", () => {
    const { root, viewport } = fixture();
    const onSelect = vi.fn();
    const controller = createCarouselController(root, { defaultValue: 2, rewind: false, onSelect });
    observations.receive?.({
      geometry: {
        physicalAxis: "x",
        sign: 1,
        viewportSize: 0,
        currentOffset: 0,
        itemStarts: [0, 0, 0],
        itemSizes: [0, 0, 0],
      },
      visibleIndices: [],
    });
    expect(controller.getSnapshot().ready).toBe(false);
    controller.refresh();
    deliver(0);
    deliver(0);
    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: 1280, behavior: "auto" });
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(1280);
    expect(controller.getSnapshot().index).toBe(2);
    expect(onSelect).not.toHaveBeenCalled();
    controller.destroy();
  });
  it("rewinds native commands and reports touch swipes only after changed settlement", () => {
    const { root, viewport } = fixture();
    const onSwipe = vi.fn();
    const controller = createCarouselController(root, { defaultValue: 0, rewind: true, onSwipe });
    deliver(0);
    root.dispatchEvent(Object.assign(new Event("command"), { command: "--uiify-previous" }));
    deliver(0);
    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: 1280, behavior: "auto" });
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(1280);
    expect(controller.getSnapshot().settledChange?.reason).toBe("command");
    expect(onSwipe).not.toHaveBeenCalled();
    viewport.dispatchEvent(Object.assign(new Event("pointerdown"), { pointerType: "touch" }));
    viewport.dispatchEvent(new Event("touchstart"));
    viewport.dispatchEvent(Object.assign(new Event("pointercancel"), { pointerType: "touch" }));
    viewport.dispatchEvent(new Event("scroll"));
    viewport.dispatchEvent(Object.assign(new Event("pointerup"), { pointerType: "touch" }));
    viewport.dispatchEvent(new Event("touchend"));
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    expect(onSwipe).toHaveBeenCalledWith({ previousIndex: 2, index: 1, reason: "scroll" });
    controller.destroy();
  });
  it.each(["next", "dot", "controlled", "wheel"] as const)(
    "does not attribute a touch tap to later %s movement",
    (kind) => {
      const { root, viewport } = fixture();
      const onSwipe = vi.fn();
      const controller = createCarouselController(root, {
        defaultValue: 0,
        rewind: false,
        onSwipe,
      });
      deliver(0);
      viewport.dispatchEvent(
        Object.assign(new Event("pointerdown"), {
          pointerType: "touch",
          pointerId: 1,
          clientX: 100,
          clientY: 100,
        }),
      );
      viewport.dispatchEvent(new Event("touchstart"));
      viewport.dispatchEvent(
        Object.assign(new Event("pointerup"), { pointerType: "touch", pointerId: 1 }),
      );
      viewport.dispatchEvent(new Event("touchend"));
      if (kind === "next") controller.next("next");
      else if (kind === "controlled")
        controller.update({ defaultValue: 0, value: 1, rewind: false, onSwipe });
      else if (kind === "dot") controller.goTo(1, "dot");
      if (kind !== "wheel") deliver(0);
      viewport.dispatchEvent(new Event("scroll"));
      viewport.dispatchEvent(new Event("scrollend"));
      deliver(640);
      expect(controller.getSnapshot().index).toBe(1);
      expect(onSwipe).not.toHaveBeenCalled();
      controller.destroy();
    },
  );
  it("preserves pre-hydration position without initial callbacks and caches snapshots", () => {
    const { root } = fixture();
    const onSelect = vi.fn();
    const controller = createCarouselController(root, { defaultValue: 2, rewind: false, onSelect });
    deliver(640);
    const snapshot = controller.getSnapshot();
    expect(snapshot.index).toBe(1);
    expect(onSelect).not.toHaveBeenCalled();
    expect(controller.getSnapshot()).toBe(snapshot);
    controller.destroy();
  });
  it("completes no-ops without scrollend and does not count them", () => {
    const { root, viewport } = fixture();
    const onSelect = vi.fn();
    const beforeChange = vi.fn();
    const controller = createCarouselController(root, {
      defaultValue: 0,
      rewind: false,
      onSelect,
      beforeChange,
    });
    deliver(0);
    controller.previous("previous");
    deliver(0);
    expect(controller.getSnapshot().moving).toBe(false);
    expect(viewport.scrollBy).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(beforeChange).not.toHaveBeenCalled();
    controller.destroy();
  });
  it("ignores superseded requests and rapidly advances from the requested page", () => {
    const { root, viewport } = fixture();
    const controller = createCarouselController(root, { defaultValue: 0, rewind: false });
    deliver(0);
    controller.next("next");
    const stale = observations.receive;
    controller.next("next");
    stale?.({
      geometry: {
        physicalAxis: "x",
        sign: 1,
        viewportSize: 640,
        currentOffset: 0,
        itemStarts: [0, 640, 1280],
        itemSizes: [640, 640, 640],
      },
      visibleIndices: [0],
    });
    expect(viewport.scrollBy).not.toHaveBeenCalled();
    deliver(0);
    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: 1280, behavior: "auto" });
    expect(controller.getSnapshot().index).toBe(0);
    controller.destroy();
  });
  it("reports only actual settlement when interrupted and ignores duplicate completion", () => {
    const { root, viewport } = fixture();
    const onSelect = vi.fn();
    const afterChange = vi.fn();
    const controller = createCarouselController(root, {
      defaultValue: 0,
      rewind: false,
      onSelect,
      afterChange,
    });
    deliver(0);
    controller.goTo(2, "dot");
    deliver(0);
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(afterChange).toHaveBeenCalledWith({ previousIndex: 0, index: 1, reason: "dot" });
    controller.destroy();
  });
  it("accepts controlled selection and reconciles rejection without selection loops", () => {
    const { root, viewport } = fixture();
    const onSelect = vi.fn();
    const afterChange = vi.fn();
    const options = { defaultValue: 0, value: 0, rewind: false, onSelect, afterChange };
    const controller = createCarouselController(root, options);
    deliver(0);
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    controller.update({ ...options, value: 1 });
    expect(controller.getSnapshot().moving).toBe(false);
    controller.update(options);
    deliver(640);
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(0);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(afterChange).toHaveBeenLastCalledWith({
      previousIndex: 1,
      index: 0,
      reason: "controlled",
    });
    controller.destroy();
  });
  it("keeps active identity after removal and cleans up subscriptions and commands", () => {
    const { root, viewport } = fixture();
    const controller = createCarouselController(root, { defaultValue: 0, rewind: true });
    deliver(0);
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    viewport.firstElementChild!.remove();
    controller.refresh();
    deliver(640, 2);
    deliver(640, 2);
    expect(viewport.scrollBy).toHaveBeenLastCalledWith({ left: -640, behavior: "auto" });
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(0, 2);
    const listener = vi.fn();
    const unsubscribe = controller.subscribe(listener);
    unsubscribe();
    controller.setInteracting(true);
    expect(listener).not.toHaveBeenCalled();
    const late = observations.receive;
    controller.destroy();
    const snapshot = controller.getSnapshot();
    late?.({
      geometry: {
        physicalAxis: "y",
        sign: -1,
        viewportSize: 640,
        currentOffset: 640,
        itemStarts: [0, 640],
        itemSizes: [640, 640],
      },
      visibleIndices: [1],
    });
    root.dispatchEvent(Object.assign(new Event("command"), { command: "--uiify-next" }));
    expect(controller.getSnapshot()).toBe(snapshot);
  });
  it("scrolls only the viewport in the observed negative block direction", () => {
    const { root, viewport } = fixture();
    const controller = createCarouselController(root, { defaultValue: 0, rewind: false });
    deliver(0);
    controller.next("next");
    observations.receive?.({
      geometry: {
        physicalAxis: "y",
        sign: -1,
        viewportSize: 640,
        currentOffset: 0,
        itemStarts: [0, 640, 1280],
        itemSizes: [640, 640, 640],
      },
      visibleIndices: [0],
    });
    expect(viewport.scrollBy).toHaveBeenCalledWith({ top: -640, behavior: "auto" });
    controller.destroy();
  });
  it("uses the manually settled page for the next command", () => {
    const { root, viewport } = fixture();
    const onSelect = vi.fn();
    const controller = createCarouselController(root, { defaultValue: 0, rewind: false, onSelect });
    deliver(0);
    viewport.dispatchEvent(new Event("scroll"));
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(640);
    expect(controller.getSnapshot().index).toBe(1);
    onSelect.mockClear();
    controller.next("next");
    deliver(640);
    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: 640, behavior: "auto" });
    viewport.dispatchEvent(new Event("scrollend"));
    deliver(1280);
    expect(controller.getSnapshot().index).toBe(2);
    expect(onSelect).toHaveBeenCalledTimes(1);
    controller.destroy();
  });
});
