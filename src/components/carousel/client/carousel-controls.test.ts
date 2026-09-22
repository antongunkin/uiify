import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CarouselAutoplayController, CarouselController } from "../types.js";
import { emptyCarouselSnapshot } from "./CarouselClientView.js";
import { attachCarouselControls } from "./carousel-controls.js";

function fixture(ready = true) {
  document.body.innerHTML = `<section data-uiify-carousel><div data-part="viewport"><div id="one"></div><div id="two"></div></div><button data-carousel-action="previous">Previous</button><button data-carousel-action="next"><span>Next</span></button><button data-carousel-action="rotation">Rotation</button><a data-part="dot" data-carousel-index="1" href="#two">Go to Two</a><a href="#one">Content link</a><section data-uiify-carousel><button data-carousel-action="next">Nested</button></section></section>`;
  const root = document.querySelector<HTMLElement>("section")!;
  const controller: CarouselController = {
    getSnapshot: () => ({ ...emptyCarouselSnapshot, ready }),
    getGeometry: () => undefined,
    subscribe: () => () => {},
    next: vi.fn(),
    previous: vi.fn(),
    goTo: vi.fn(),
    setInteracting: vi.fn(),
    update: vi.fn(),
    refresh: vi.fn(),
    destroy: vi.fn(),
  };
  return {
    root,
    controller,
    anchor: root.querySelector<HTMLAnchorElement>('[data-part="dot"]')!,
  };
}
afterEach(() => {
  document.body.innerHTML = "";
});
describe("delegated carousel controls", () => {
  it("preserves modified, middle, external, and ordinary link activations", () => {
    const { root, controller, anchor } = fixture();
    const detach = attachCarouselControls(root, controller);
    for (const modifier of [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ]) {
      expect(fireEvent.click(anchor, modifier)).toBe(true);
    }
    expect(controller.goTo).not.toHaveBeenCalled();
    expect(fireEvent.click(anchor)).toBe(false);
    expect(controller.goTo).toHaveBeenCalledWith(1, "dot");
    vi.mocked(controller.goTo).mockClear();
    anchor.href = "https://example.com/#two";
    root.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(anchor);
    fireEvent.click(root.querySelector('a[href="#one"]')!);
    expect(controller.goTo).not.toHaveBeenCalled();
    detach();
  });
  it("delegates nested button content but excludes nested carousels, disabled controls and cleanup", () => {
    const { root, controller } = fixture();
    const detach = attachCarouselControls(root, controller);
    fireEvent.click(root.querySelector("span")!);
    expect(controller.next).toHaveBeenCalledExactlyOnceWith("next");
    fireEvent.click(root.querySelector(":scope > section button")!);
    const previous = root.querySelector<HTMLButtonElement>('[data-carousel-action="previous"]')!;
    previous.disabled = true;
    fireEvent.click(previous);
    expect(controller.previous).not.toHaveBeenCalled();
    detach();
    fireEvent.click(root.querySelector("span")!);
    expect(controller.next).toHaveBeenCalledTimes(1);
  });
  it("leaves dot links native until the controller is ready", () => {
    const { root, controller, anchor } = fixture(false);
    const detach = attachCarouselControls(root, controller);
    expect(fireEvent.click(anchor)).toBe(true);
    expect(controller.goTo).not.toHaveBeenCalled();
    detach();
  });
  it("uses requested rotation state for explicit start/stop actions", () => {
    const { root, controller } = fixture();
    let requested = false;
    const autoplay: CarouselAutoplayController = {
      getSnapshot: () => ({ requested, playing: false, completedAdvances: 0 }),
      subscribe: () => () => {},
      start: vi.fn(),
      stop: vi.fn(),
      reset: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
    };
    const detach = attachCarouselControls(root, controller, autoplay);
    fireEvent.click(root.querySelector('[data-carousel-action="rotation"]')!);
    expect(autoplay.start).toHaveBeenCalledOnce();
    requested = true;
    fireEvent.click(root.querySelector('[data-carousel-action="rotation"]')!);
    expect(autoplay.stop).toHaveBeenCalledOnce();
    detach();
  });
});
