import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createFadeController } from "./fade-controller.js";

let root: HTMLElement;
let slides: HTMLElement[];
const controllers: ReturnType<typeof createFadeController>[] = [];
function create(options = {}) {
  const controller = createFadeController(root, { defaultValue: 0, rewind: false, ...options });
  controllers.push(controller);
  return controller;
}
async function frame() {
  await vi.advanceTimersByTimeAsync(20);
}
beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `<section data-uiify-carousel><button>Control</button><div data-part="viewport" tabindex="0">${[0, 1, 2].map((i) => `<div id="s${i}" data-part="slide"><button>Content ${i}</button></div>`).join("")}</div></section>`;
  root = document.querySelector("section")!;
  slides = Array.from(root.querySelectorAll('[data-part="slide"]'));
  for (const slide of slides) slide.getAnimations = () => [];
});
afterEach(() => {
  controllers.splice(0).forEach((c) => c.destroy());
  vi.useRealTimers();
  document.body.innerHTML = "";
  history.replaceState(null, "", location.pathname);
});

it("initializes one page per item and keeps inactive slides inert", () => {
  const c = create({ defaultValue: 1 });
  expect(c.getSnapshot()).toMatchObject({
    ready: true,
    index: 1,
    visibleIndices: [1],
    atStart: false,
    atEnd: false,
  });
  expect(c.getSnapshot().pages).toHaveLength(3);
  expect(slides[0]!.getAttribute("aria-hidden")).toBe("true");
  expect(slides[0]!.hasAttribute("inert")).toBe(true);
  expect(slides[1]!.hasAttribute("inert")).toBe(false);
});
it("publishes requested state immediately and completes callbacks once in order", async () => {
  const events: string[] = [];
  const c = create({
    beforeChange: () => events.push("before"),
    onSelect: () => events.push("select"),
    afterChange: () => events.push("after"),
    onSwipe: () => events.push("swipe"),
  });
  c.next("drag");
  c.next("next");
  expect(c.getSnapshot()).toMatchObject({ index: 0, requestedIndex: 1, moving: true });
  expect(slides[0]!.hasAttribute("inert")).toBe(true);
  expect(slides[1]!.getAttribute("data-state")).toBe("active");
  expect(events).toEqual(["before"]);
  await frame();
  expect(c.getSnapshot()).toMatchObject({ index: 1, requestedIndex: null, moving: false });
  expect(events).toEqual(["before", "select", "after", "swipe"]);
});
it("waits for own CSS transitions but ignores child animations and handles cancellation", async () => {
  let reject!: (error: Error) => void;
  const finished = new Promise<Animation>((_, fail) => {
    reject = fail;
  });
  slides[1]!.getAnimations = () =>
    [
      { transitionProperty: "opacity", effect: { target: slides[1] }, finished },
    ] as unknown as Animation[];
  slides[0]!.getAnimations = () =>
    [
      {
        transitionProperty: "opacity",
        effect: { target: slides[0]!.firstChild },
        finished: new Promise(() => {}),
      },
    ] as unknown as Animation[];
  const c = create();
  c.next("next");
  await frame();
  expect(c.getSnapshot().moving).toBe(true);
  reject(new Error("cancelled"));
  await Promise.resolve();
  await Promise.resolve();
  expect(c.getSnapshot()).toMatchObject({ moving: false, index: 1 });
});
it("clamps finite ends without callbacks and wraps only with rewind", async () => {
  const afterChange = vi.fn();
  const c = create({ afterChange });
  c.previous("previous");
  await frame();
  expect(afterChange).not.toHaveBeenCalled();
  c.goTo(20, "command");
  await frame();
  expect(c.getSnapshot().index).toBe(2);
  c.next("next");
  await frame();
  expect(afterChange).toHaveBeenCalledTimes(1);
  c.update({ defaultValue: 0, rewind: true });
  c.next("next");
  await frame();
  expect(c.getSnapshot().index).toBe(0);
});
it("does not hide focused slide content and preserves pre-hydration focus", async () => {
  slides[2]!.querySelector("button")!.focus();
  const c = create();
  expect(c.getSnapshot().index).toBe(2);
  c.previous("previous");
  await frame();
  expect(c.getSnapshot().index).toBe(2);
  root.querySelector("button")!.focus();
  c.previous("previous");
  await frame();
  expect(c.getSnapshot().index).toBe(1);
});
it("accepts latest controlled reconciliation only after current motion settles", async () => {
  const onSelect = vi.fn();
  const c = create({ onSelect });
  c.next("next");
  c.update({ defaultValue: 0, rewind: false, value: 2, onSelect });
  await frame();
  expect(c.getSnapshot()).toMatchObject({ index: 1, requestedIndex: 2, moving: true });
  await frame();
  expect(c.getSnapshot().index).toBe(2);
  expect(onSelect).toHaveBeenCalledTimes(1);
});
it("retains active item by id on refresh and cancels obsolete completion on removal", async () => {
  const afterChange = vi.fn();
  const c = create({ defaultValue: 1, afterChange });
  slides[0]!.remove();
  c.refresh();
  expect(c.getSnapshot().index).toBe(0);
  c.next("next");
  slides[2]!.remove();
  c.refresh();
  await frame();
  expect(c.getSnapshot()).toMatchObject({ index: 0, moving: false });
  expect(afterChange).not.toHaveBeenCalled();
});
it("ignores asynchronous completion after destroy and restores readable fallback", async () => {
  const afterChange = vi.fn();
  const c = create({ afterChange });
  c.next("next");
  c.destroy();
  await frame();
  expect(afterChange).not.toHaveBeenCalled();
  expect(root.hasAttribute("data-fade-ready")).toBe(false);
  expect(
    slides.every((slide) => !slide.hasAttribute("inert") && !slide.hasAttribute("aria-hidden")),
  ).toBe(true);
});

it("preserves an initial fragment and supports native commands without reacting to nested commands", async () => {
  history.replaceState(null, "", "#s1");
  const c = create();
  expect(c.getSnapshot().index).toBe(1);
  const command = new Event("command", { bubbles: true });
  Object.assign(command, { command: "--uiify-next" });
  slides[1]!.dispatchEvent(command);
  expect(c.getSnapshot().moving).toBe(false);
  root.dispatchEvent(command);
  await frame();
  expect(c.getSnapshot().index).toBe(2);
});

it("does not synthesize completion when a pending CSS transition outlives destruction", async () => {
  let complete!: (animation: Animation) => void;
  const finished = new Promise<Animation>((resolve) => {
    complete = resolve;
  });
  slides[1]!.getAnimations = () =>
    [
      { transitionProperty: "opacity", effect: { target: slides[1] }, finished },
    ] as unknown as Animation[];
  const afterChange = vi.fn();
  const c = create({ afterChange });
  c.next("next");
  await frame();
  c.destroy();
  complete({} as Animation);
  await Promise.resolve();
  await Promise.resolve();
  expect(afterChange).not.toHaveBeenCalled();
});
