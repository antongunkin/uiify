import { cleanup, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { CarouselClientHandle } from "../types.js";
import { CarouselClient } from "./CarouselClient.js";

const adapters = vi.hoisted(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  reset: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  detachDrag: vi.fn(),
  attachDrag: vi.fn(),
}));
vi.mock("./carousel-observer.js", () => ({
  observeCarousel: () => ({ measure: () => {}, destroy: () => {} }),
}));
vi.mock("./carousel-autoplay.js", () => ({
  createCarouselAutoplay: () => ({
    getSnapshot: () => undefined,
    subscribe: () => () => {},
    start: adapters.start,
    stop: adapters.stop,
    reset: adapters.reset,
    update: adapters.update,
    destroy: adapters.destroy,
  }),
}));
vi.mock("./carousel-drag.js", () => ({
  attachCarouselDrag: (...args: unknown[]) => {
    adapters.attachDrag(...args);
    return adapters.detachDrag;
  },
}));
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

it("wires optional autoplay handles and mouse drag and cleans both up on disabling", () => {
  const ref = createRef<CarouselClientHandle>();
  const items = [
    { id: "one", label: "One", children: "One" },
    { id: "two", label: "Two", children: "Two" },
  ];
  const { rerender } = render(
    <CarouselClient
      id="adapters"
      aria-label="Gallery"
      items={items}
      ref={ref}
      autoplay={{ delay: 2500 }}
      mouseDrag
    />,
  );
  ref.current?.start();
  ref.current?.stop();
  ref.current?.reset();
  expect(adapters.start).toHaveBeenCalledOnce();
  expect(adapters.stop).toHaveBeenCalledOnce();
  expect(adapters.reset).toHaveBeenCalledOnce();
  expect(adapters.update).toHaveBeenCalledWith({ delay: 2500 });
  expect(adapters.attachDrag).toHaveBeenCalledOnce();
  rerender(<CarouselClient id="adapters" aria-label="Gallery" items={items} ref={ref} />);
  expect(adapters.destroy).toHaveBeenCalledOnce();
  expect(adapters.detachDrag).toHaveBeenCalledOnce();
});
