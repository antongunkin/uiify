import { afterEach, describe, expect, it, vi } from "vitest";
import type { CarouselController, CarouselGeometry, CarouselSnapshot } from "../types.js";
import { emptyCarouselSnapshot } from "./CarouselClientView.js";
import { attachCarouselDrag } from "./carousel-drag.js";

interface FixtureOptions {
  readonly geometry?: CarouselGeometry;
  readonly refreshedGeometry?: CarouselGeometry;
}

function pointer(type: string, init: PointerEventInit): PointerEvent {
  return new PointerEvent(type, { bubbles: true, cancelable: true, ...init });
}

function createFixture(options: FixtureOptions = {}) {
  document.body.innerHTML = `
    <section data-uiify-carousel>
      <div data-uiify-carousel-viewport>
        <article data-uiify-carousel-slide>
          <span data-drag-target>Drag target</span>
          <button type="button">Action</button>
          <section data-uiify-carousel>
            <div data-uiify-carousel-viewport><span data-nested-target>Nested</span></div>
          </section>
        </article>
      </div>
    </section>`;
  const root = document.querySelector<HTMLElement>("section")!;
  const viewport = root.querySelector<HTMLElement>(":scope > [data-uiify-carousel-viewport]")!;
  const target = viewport.querySelector<HTMLElement>("[data-drag-target]")!;
  const setPointerCapture = vi.fn();
  const releasePointerCapture = vi.fn();
  const captured = new Set<number>();
  setPointerCapture.mockImplementation((pointerId: number) => captured.add(pointerId));
  releasePointerCapture.mockImplementation((pointerId: number) => captured.delete(pointerId));
  Object.assign(viewport, {
    scrollBy: vi.fn(),
    setPointerCapture,
    releasePointerCapture,
    hasPointerCapture: (pointerId: number) => captured.has(pointerId),
  });
  let geometry = options.geometry;
  let snapshot: CarouselSnapshot = { ...emptyCarouselSnapshot, ready: true };
  const controller: CarouselController = {
    getSnapshot: () => snapshot,
    getGeometry: () => geometry,
    subscribe: vi.fn(() => () => {}),
    goTo: vi.fn(),
    next: vi.fn(),
    previous: vi.fn(),
    setInteracting: vi.fn((interacting: boolean) => {
      snapshot = { ...snapshot, interacting };
    }),
    update: vi.fn(),
    refresh: vi.fn(() => {
      geometry = options.refreshedGeometry ?? geometry;
    }),
    destroy: vi.fn(),
  };
  return {
    root,
    viewport,
    target,
    controller,
    scrollBy: vi.mocked(viewport.scrollBy),
    setPointerCapture,
    releasePointerCapture,
  };
}

const horizontal: CarouselGeometry = {
  physicalAxis: "x",
  sign: 1,
  viewportSize: 100,
  currentOffset: 0,
  itemStarts: [0, 100, 200],
  itemSizes: [100, 100, 100],
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("carousel mouse drag", () => {
  it("waits for mouse drag intent, captures, and writes incremental physical deltas", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);

    const down = pointer("pointerdown", {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 100,
      button: 0,
    });
    fixture.target.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(false);
    expect(fixture.setPointerCapture).not.toHaveBeenCalled();
    expect(fixture.controller.setInteracting).not.toHaveBeenCalled();

    const pending = pointer("pointermove", {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 97,
      buttons: 1,
    });
    fixture.viewport.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(false);
    expect(fixture.scrollBy).not.toHaveBeenCalled();

    const start = pointer("pointermove", {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 90,
      buttons: 1,
    });
    fixture.viewport.dispatchEvent(start);
    expect(start.defaultPrevented).toBe(true);
    expect(fixture.setPointerCapture).toHaveBeenCalledExactlyOnceWith(1);
    expect(fixture.controller.setInteracting).toHaveBeenCalledExactlyOnceWith(true);
    expect(fixture.viewport.getAttribute("data-dragging")).toBe("");
    expect(fixture.scrollBy).toHaveBeenLastCalledWith({ left: 10, behavior: "auto" });

    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 1,
        clientX: 84,
        buttons: 1,
      }),
    );
    expect(fixture.scrollBy).toHaveBeenLastCalledWith({ left: 6, behavior: "auto" });
    detach();
  });

  it("uses the observed physical axis and works when progression is reversed", () => {
    const fixture = createFixture({
      geometry: { ...horizontal, physicalAxis: "y", sign: -1 },
    });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);

    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 2,
        clientX: 300,
        clientY: 80,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 2,
        clientX: 100,
        clientY: 68,
        buttons: 1,
      }),
    );

    expect(fixture.scrollBy).toHaveBeenCalledWith({ top: 12, behavior: "auto" });
    detach();
  });

  it("leaves touch, pen, nonprimary buttons, and interactive descendants entirely native", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    const button = fixture.viewport.querySelector("button")!;

    for (const [target, init] of [
      [fixture.target, { pointerType: "touch", pointerId: 3, clientX: 100, button: 0 }],
      [fixture.target, { pointerType: "pen", pointerId: 4, clientX: 100, button: 0 }],
      [fixture.target, { pointerType: "mouse", pointerId: 5, clientX: 100, button: 1 }],
      [button, { pointerType: "mouse", pointerId: 6, clientX: 100, button: 0 }],
    ] as const) {
      target.dispatchEvent(pointer("pointerdown", init));
      fixture.viewport.dispatchEvent(
        pointer("pointermove", {
          pointerType: init.pointerType,
          pointerId: init.pointerId,
          clientX: 70,
          buttons: 1,
        }),
      );
    }

    expect(fixture.setPointerCapture).not.toHaveBeenCalled();
    expect(fixture.controller.setInteracting).not.toHaveBeenCalled();
    expect(fixture.scrollBy).not.toHaveBeenCalled();
    expect(fixture.viewport.hasAttribute("data-dragging")).toBe(false);
    detach();
  });

  it("stays inactive until the controller has a coherent geometry snapshot", () => {
    const fixture = createFixture();
    const detach = attachCarouselDrag(fixture.root, fixture.controller);

    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 7,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 7,
        clientX: 60,
        buttons: 1,
      }),
    );

    expect(fixture.setPointerCapture).not.toHaveBeenCalled();
    expect(fixture.scrollBy).not.toHaveBeenCalled();
    detach();
  });

  it("clears pending intent when the mouse is released outside before re-entry", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 15,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 15,
        clientX: 98,
        buttons: 1,
      }),
    );

    // Re-entry after an outside release reports no pressed primary button.
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 15,
        clientX: 50,
        buttons: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 15,
        clientX: 20,
        buttons: 1,
      }),
    );

    expect(fixture.setPointerCapture).not.toHaveBeenCalled();
    expect(fixture.controller.setInteracting).not.toHaveBeenCalled();
    expect(fixture.scrollBy).not.toHaveBeenCalled();
    detach();
  });

  it("restores drag state and settles to the nearest freshly observed page", () => {
    const fixture = createFixture({
      geometry: horizontal,
      refreshedGeometry: { ...horizontal, currentOffset: 132 },
    });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);

    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 8,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 8,
        clientX: 70,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointerup", { pointerType: "mouse", pointerId: 8, clientX: 70 }),
    );

    expect(fixture.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(8);
    expect(fixture.viewport.hasAttribute("data-dragging")).toBe(false);
    expect(fixture.controller.setInteracting).toHaveBeenLastCalledWith(false);
    expect(fixture.controller.refresh).toHaveBeenCalledOnce();
    expect(fixture.controller.goTo).toHaveBeenCalledExactlyOnceWith(1, "drag");
    detach();
  });

  it("settles from its known scroll deltas while observer refresh remains asynchronous", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 14,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 14,
        clientX: 35,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointerup", { pointerType: "mouse", pointerId: 14, clientX: 35 }),
    );

    expect(fixture.controller.refresh).toHaveBeenCalledOnce();
    expect(fixture.controller.goTo).toHaveBeenCalledExactlyOnceWith(1, "drag");
    detach();
  });

  it.each(["pointercancel", "lostpointercapture"])("restores and settles on %s", (eventType) => {
    const fixture = createFixture({
      geometry: horizontal,
      refreshedGeometry: { ...horizontal, currentOffset: 190 },
    });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    const click = vi.fn();
    fixture.target.addEventListener("click", click);
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 9,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 9,
        clientX: 80,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer(eventType, { pointerType: "mouse", pointerId: 9, clientX: 80 }),
    );

    expect(fixture.viewport.hasAttribute("data-dragging")).toBe(false);
    expect(fixture.controller.setInteracting).toHaveBeenLastCalledWith(false);
    expect(fixture.controller.goTo).toHaveBeenCalledExactlyOnceWith(2, "drag");
    fixture.target.click();
    expect(click).toHaveBeenCalledOnce();
    detach();
  });

  it("continues an active captured drag outside the viewport", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 10,
        clientX: 20,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 10,
        clientX: 10,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 10,
        clientX: -40,
        buttons: 1,
      }),
    );

    expect(fixture.scrollBy).toHaveBeenLastCalledWith({ left: 50, behavior: "auto" });
    detach();
  });

  it("ignores events owned by a nested carousel", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    const nested = fixture.root.querySelector<HTMLElement>("[data-nested-target]")!;

    nested.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 11,
        clientX: 100,
        button: 0,
      }),
    );
    nested.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 11,
        clientX: 50,
        buttons: 1,
      }),
    );

    expect(fixture.setPointerCapture).not.toHaveBeenCalled();
    expect(fixture.scrollBy).not.toHaveBeenCalled();
    detach();
  });

  it("cancels exactly one click after a drag but preserves ordinary clicks", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    const click = vi.fn();
    fixture.target.addEventListener("click", click);

    fixture.target.click();
    expect(click).toHaveBeenCalledOnce();
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 12,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 12,
        clientX: 80,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointerup", { pointerType: "mouse", pointerId: 12, clientX: 80 }),
    );

    fixture.target.click();
    expect(click).toHaveBeenCalledOnce();
    fixture.target.click();
    expect(click).toHaveBeenCalledTimes(2);
    detach();
  });

  it("destroy restores an active drag and removes every listener", () => {
    const fixture = createFixture({ geometry: horizontal });
    const detach = attachCarouselDrag(fixture.root, fixture.controller);
    fixture.target.dispatchEvent(
      pointer("pointerdown", {
        pointerType: "mouse",
        pointerId: 13,
        clientX: 100,
        button: 0,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 13,
        clientX: 80,
        buttons: 1,
      }),
    );

    detach();
    expect(fixture.viewport.hasAttribute("data-dragging")).toBe(false);
    expect(fixture.controller.setInteracting).toHaveBeenLastCalledWith(false);
    expect(fixture.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(13);
    const calls = fixture.scrollBy.mock.calls.length;
    fixture.viewport.dispatchEvent(
      pointer("pointermove", {
        pointerType: "mouse",
        pointerId: 13,
        clientX: 20,
        buttons: 1,
      }),
    );
    fixture.viewport.dispatchEvent(
      pointer("pointerup", { pointerType: "mouse", pointerId: 13, clientX: 20 }),
    );
    fixture.target.click();
    expect(fixture.scrollBy).toHaveBeenCalledTimes(calls);
    expect(fixture.controller.refresh).not.toHaveBeenCalled();
  });
});
