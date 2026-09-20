import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
// @ts-expect-error The repository audit is a JavaScript build tool.
import { findBannedReads } from "../../../../scripts/check-banned-layout-reads.mjs";
import { observeCarousel } from "./carousel-observer.js";

const instances: IntersectionObserverMock[] = [];
class IntersectionObserverMock {
  nodes: Element[] = [];
  disconnected = false;
  constructor(readonly callback: IntersectionObserverCallback) {
    instances.push(this);
  }
  observe(node: Element) {
    this.nodes.push(node);
  }
  disconnect() {
    this.disconnected = true;
  }
  deliver(rects: DOMRect[], bounds: DOMRect | null = new DOMRect(0, 0, 640, 640)) {
    this.callback(
      this.nodes.map((target, i) => ({
        target,
        boundingClientRect: rects[i]!,
        rootBounds: bounds,
        intersectionRatio: i === 0 ? 1 : 0,
        isIntersecting: i === 0,
        intersectionRect: rects[i]!,
        time: 0,
      })),
      this as unknown as IntersectionObserver,
    );
  }
}
beforeEach(() => {
  instances.length = 0;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  document.body.innerHTML =
    "<section><div data-uiify-carousel-viewport><div data-uiify-carousel-slide><section><div data-uiify-carousel-slide></div></section></div><div data-uiify-carousel-slide></div><div data-uiify-carousel-slide></div></div></section>";
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

it.each([
  { axis: "x", sign: 1, rects: [-640, 0, 640].map((x) => new DOMRect(x, 0, 640, 640)) },
  { axis: "x", sign: -1, rects: [640, 0, -640].map((x) => new DOMRect(x, 0, 640, 640)) },
  { axis: "y", sign: 1, rects: [-640, 0, 640].map((y) => new DOMRect(0, y, 640, 640)) },
  { axis: "y", sign: -1, rects: [640, 0, -640].map((y) => new DOMRect(0, y, 640, 640)) },
])("normalizes $axis progression $sign and excludes nested slides", ({ axis, sign, rects }) => {
  const observer = observeCarousel(document.querySelector("section")!);
  const receive = vi.fn();
  observer.measure(receive);
  instances.at(-1)!.deliver(rects);
  expect(receive).toHaveBeenCalledWith({
    geometry: {
      physicalAxis: axis,
      sign,
      viewportSize: 640,
      currentOffset: 640,
      itemStarts: [0, 640, 1280],
      itemSizes: [640, 640, 640],
    },
    visibleIndices: [0],
  });
  observer.destroy();
});
it("discards superseded, incomplete, hidden and destroyed generations", () => {
  const observer = observeCarousel(document.querySelector("section")!);
  const receive = vi.fn();
  observer.measure(receive);
  const old = instances.at(-1)!;
  observer.measure(receive);
  old.deliver([0, 640, 1280].map((x) => new DOMRect(x, 0, 640, 640)));
  expect(receive).not.toHaveBeenCalled();
  const current = instances.at(-1)!;
  current.deliver(
    [0, 0, 0].map(() => new DOMRect()),
    new DOMRect(),
  );
  expect(receive).not.toHaveBeenCalled();
  observer.measure(receive);
  instances.at(-1)!.deliver([0, 640, 1280].map((x) => new DOMRect(x, 0, 640, 640)));
  expect(receive).toHaveBeenCalledTimes(1);
  observer.measure(receive);
  observer.destroy();
  instances.at(-1)!.deliver([0, 640, 1280].map((x) => new DOMRect(x, 0, 640, 640)));
  expect(receive).toHaveBeenCalledTimes(1);
});
it("clamps elastic overscroll", () => {
  const observer = observeCarousel(document.querySelector("section")!);
  const receive = vi.fn();
  observer.measure(receive);
  instances.at(-1)!.deliver([100, 740, 1380].map((x) => new DOMRect(x, 0, 640, 640)));
  expect(receive.mock.calls[0]![0].geometry.currentOffset).toBe(0);
  observer.destroy();
});
it("waits for every direct slide before producing coherent geometry", () => {
  const observer = observeCarousel(document.querySelector("section")!);
  const receive = vi.fn();
  observer.measure(receive);
  const current = instances.at(-1)!;
  const entries = current.nodes.map((target, index) => ({
    target,
    boundingClientRect: new DOMRect(index * 640, 0, 640, 640),
    rootBounds: new DOMRect(0, 0, 640, 640),
    intersectionRatio: index === 0 ? 1 : 0,
    isIntersecting: index === 0,
    intersectionRect: new DOMRect(),
    time: 0,
  }));
  current.callback(entries.slice(0, 1), current as unknown as IntersectionObserver);
  expect(receive).not.toHaveBeenCalled();
  current.callback(entries.slice(1), current as unknown as IntersectionObserver);
  expect(receive).toHaveBeenCalledTimes(1);
  observer.destroy();
});
it("audits actual observer and controller source for banned synchronous reads", () => {
  const files = ["carousel-observer.ts", "carousel-controller.ts"];
  for (const file of files)
    expect(findBannedReads(file, readFileSync(new URL(file, import.meta.url), "utf8"))).toEqual([]);
  expect(files.length).toBeGreaterThan(0);
});
