import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createFadeController } from "./fade-controller.js";
import { attachFadeSwipe } from "./fade-swipe.js";

let root: HTMLElement;
let viewport: HTMLElement;
let controller: ReturnType<typeof createFadeController>;
let detach: () => void;
let resize: ResizeObserverCallback;
function pointer(
  type: string,
  x: number,
  y = 0,
  pointerType = "touch",
  target = viewport,
  buttons = 1,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, {
    pointerId: 1,
    pointerType,
    button: 0,
    buttons,
    clientX: x,
    clientY: y,
    isPrimary: true,
  });
  target.dispatchEvent(event);
  return event;
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  document.body.innerHTML =
    '<section data-uiify-carousel><div data-part="viewport"><div id="a" data-part="slide"><button>Button</button></div><div id="b" data-part="slide"></div></div></section>';
  root = document.querySelector("section")!;
  viewport = root.firstElementChild as HTMLElement;
  viewport.setPointerCapture = vi.fn();
  viewport.hasPointerCapture = () => true;
  viewport.releasePointerCapture = vi.fn();
  for (const slide of Array.from(viewport.children)) slide.getAnimations = () => [];
  controller = createFadeController(root, { defaultValue: 0, rewind: false });
  detach = attachFadeSwipe(root, controller, false);
  resize(
    [
      { target: viewport, contentBoxSize: [{ inlineSize: 300, blockSize: 200 }] },
    ] as unknown as ResizeObserverEntry[],
    {} as ResizeObserver,
  );
});

it.each([true, false])(
  "clears a pending mouse gesture after outside release (delivered: %s)",
  async (deliverRelease) => {
    detach();
    detach = attachFadeSwipe(root, controller, true);
    pointer("pointerdown", 200, 0, "mouse");
    if (deliverRelease) pointer("pointerup", 198, 0, "mouse", document.body, 0);
    const reentry = pointer("pointermove", 0, 0, "mouse", viewport, 0);
    expect(reentry.defaultPrevented).toBe(false);
    expect(controller.getSnapshot().interacting).toBe(false);
    pointer("pointerup", 0, 0, "mouse", viewport, 0);
    await vi.advanceTimersByTimeAsync(20);
    expect(controller.getSnapshot().index).toBe(0);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    viewport.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    pointer("pointerdown", 200, 0, "mouse");
    pointer("pointermove", 0, 0, "mouse");
    pointer("pointerup", 0, 0, "mouse", viewport, 0);
    await vi.advanceTimersByTimeAsync(20);
    expect(controller.getSnapshot().index).toBe(1);
  },
);
afterEach(() => {
  detach();
  controller.destroy();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});
it("requires dominant horizontal travel of one third of width and suppresses only the resulting click", async () => {
  pointer("pointerdown", 200);
  pointer("pointermove", 101);
  pointer("pointerup", 101);
  await vi.advanceTimersByTimeAsync(20);
  expect(controller.getSnapshot().index).toBe(0);
  pointer("pointerdown", 200);
  pointer("pointermove", 90);
  pointer("pointerup", 90);
  await vi.advanceTimersByTimeAsync(20);
  expect(controller.getSnapshot().index).toBe(1);
  const click = new MouseEvent("click", { bubbles: true, cancelable: true });
  viewport.dispatchEvent(click);
  expect(click.defaultPrevented).toBe(true);
  const second = new MouseEvent("click", { bubbles: true, cancelable: true });
  viewport.dispatchEvent(second);
  expect(second.defaultPrevented).toBe(false);
});
it("retains vertical intent, taps, mouse opt-out and nested button clicks", async () => {
  pointer("pointerdown", 200);
  expect(pointer("pointermove", 90, 150).defaultPrevented).toBe(false);
  pointer("pointerup", 90, 150);
  pointer("pointerdown", 200, 0, "mouse");
  pointer("pointermove", 0, 0, "mouse");
  pointer("pointerup", 0, 0, "mouse");
  const button = root.querySelector("button")!;
  pointer("pointerdown", 200, 0, "touch", button);
  pointer("pointermove", 0);
  pointer("pointerup", 0);
  pointer("pointerdown", 200);
  pointer("pointerup", 200);
  await vi.advanceTimersByTimeAsync(20);
  expect(controller.getSnapshot().index).toBe(0);
});
it("supports optional mouse, RTL direction and clears interaction on cancellation and teardown", async () => {
  detach();
  root.dir = "rtl";
  detach = attachFadeSwipe(root, controller, true);
  pointer("pointerdown", 0, 0, "mouse");
  pointer("pointermove", 120, 0, "mouse");
  expect(controller.getSnapshot().interacting).toBe(true);
  pointer("pointercancel", 120, 0, "mouse");
  expect(controller.getSnapshot().interacting).toBe(false);
  pointer("pointerdown", 0, 0, "mouse");
  pointer("pointermove", 120, 0, "mouse");
  pointer("pointerup", 120, 0, "mouse");
  await vi.advanceTimersByTimeAsync(20);
  expect(controller.getSnapshot().index).toBe(1);
  pointer("pointerdown", 200, 0, "mouse");
  pointer("pointermove", 0, 0, "mouse");
  detach();
  expect(controller.getSnapshot().interacting).toBe(false);
});
