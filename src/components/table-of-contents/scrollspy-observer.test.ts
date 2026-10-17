import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { observeTableOfContents } from "./scrollspy.js";

class Observer {
  static instances: Observer[] = [];
  readonly root: Element | Document | null;
  readonly rootMargin = "0px";
  readonly thresholds = [0, 1];
  readonly nodes = new Set<Element>();
  disconnected = false;
  constructor(
    readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.root = options?.root ?? null;
    Observer.instances.push(this);
  }
  observe(node: Element) {
    this.nodes.add(node);
  }
  unobserve(node: Element) {
    this.nodes.delete(node);
  }
  disconnect() {
    this.disconnected = true;
    this.nodes.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  deliver(positions: readonly [Element, number, number][]) {
    const entries = positions.map(([target, start, height]) => {
      const rect = new DOMRect(0, start, 100, height);
      return {
        target,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: new DOMRect(0, 0, 100, 800),
        isIntersecting: true,
        intersectionRatio: 1,
        time: 0,
      };
    });
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
class Resize {
  static instances: Resize[] = [];
  constructor(readonly callback: ResizeObserverCallback) {
    Resize.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  deliver() {
    this.callback([], this as unknown as ResizeObserver);
  }
}
beforeEach(() => {
  Observer.instances = [];
  Resize.instances = [];
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Resize);
  vi.useFakeTimers();
  document.body.innerHTML =
    '<nav data-uiify-table-of-contents=""><a data-part="link" href="#later">Later</a><a data-part="link" href="#intro">Intro</a></nav><article id="article"><h2 id="intro">Intro</h2><h2 id="later">Later</h2></article>';
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});
const root = () => document.querySelector("nav")!;
const target = (id: string) => document.getElementById(id)!;
function deliver(observer: Observer, first: number, second: number, end = 2000) {
  observer.deliver([
    [target("later"), second, 20],
    [target("article"), 0, end],
    [target("intro"), first, 20],
  ]);
}

describe("TableOfContents observed scrolling", () => {
  it("scopes default mutation observation to represented article boundaries", () => {
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const controller = observeTableOfContents({ root: root(), offset: 0, onValueChange() {} });
    expect(observe.mock.calls.some(([node]) => node === document.documentElement)).toBe(false);
    expect(observe.mock.calls.some(([node]) => node === target("article"))).toBe(true);
    controller.destroy();
    observe.mockRestore();
  });
  it("uses DOM order regardless of callback/link order and caches geometry between scroll events", () => {
    const values: (string | null)[] = [];
    const controller = observeTableOfContents({
      root: root(),
      contentTarget: "article",
      offset: 80,
      onValueChange: (value) => values.push(value),
    });
    deliver(Observer.instances.at(-1)!, 40, 400);
    expect(values).toEqual(["intro"]);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 600 });
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);
    expect(values).toEqual(["intro", "later"]);
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);
    expect(values).toEqual(["intro", "later"]);
    controller.destroy();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20);
    expect(values).toEqual(["intro", "later"]);
  });
  it("does not fall back to window when the specified scroll root is absent", async () => {
    const values: (string | null)[] = [];
    const controller = observeTableOfContents({
      root: root(),
      scrollTarget: "scroller",
      contentTarget: "article",
      offset: 80,
      onValueChange: (value) => values.push(value),
    });
    expect(values).toEqual([null]);
    expect(Observer.instances).toHaveLength(0);
    const scroller = document.createElement("div");
    scroller.id = "scroller";
    scroller.append(target("article"));
    document.body.append(scroller);
    await Promise.resolve();
    vi.advanceTimersByTime(20);
    const observer = Observer.instances.at(-1)!;
    expect(observer.root).toBe(scroller);
    expect(observer.nodes.has(scroller)).toBe(false);
    deliver(observer, 40, 400);
    expect(values).toEqual([null, "intro"]);
    controller.destroy();
  });
  it("refreshes moved heading snapshots after resize and ignores stale deliveries", () => {
    const values: (string | null)[] = [];
    const controller = observeTableOfContents({
      root: root(),
      contentTarget: "article",
      offset: 80,
      onValueChange: (value) => values.push(value),
    });
    const original = Observer.instances.at(-1)!;
    deliver(original, 40, 400);
    Resize.instances[0]!.deliver();
    vi.advanceTimersByTime(20);
    const updated = Observer.instances.at(-1)!;
    deliver(updated, -400, 20);
    expect(values).toEqual(["intro", "later"]);
    deliver(original, 40, 400);
    expect(values).toEqual(["intro", "later"]);
    controller.destroy();
  });
});
