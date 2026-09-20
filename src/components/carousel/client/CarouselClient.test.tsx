import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CarouselClientHandle, CarouselObservation } from "../types.js";
import { CarouselClient } from "./CarouselClient.js";

const observation = vi.hoisted(() => ({
  receive: undefined as ((value: CarouselObservation) => void) | undefined,
  destroy: vi.fn(),
}));
vi.mock("./carousel-observer.js", () => ({
  observeCarousel: () => ({
    measure: (receive: (value: CarouselObservation) => void) => {
      observation.receive = receive;
    },
    destroy: observation.destroy,
  }),
}));
const items = ["One", "Two", "Three"].map((label) => ({
  id: label.toLowerCase(),
  label,
  children: <button>{label} content</button>,
}));
function deliver(offset = 0, viewportSize = 100, count = 3) {
  act(() =>
    observation.receive?.({
      geometry: {
        physicalAxis: "x",
        sign: 1,
        viewportSize,
        currentOffset: offset,
        itemStarts: Array.from({ length: count }, (_, i) => i * 100),
        itemSizes: Array.from({ length: count }, () => 100),
      },
      visibleIndices: [Math.round(offset / 100)],
    }),
  );
}
beforeEach(() => {
  observation.destroy.mockClear();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollBy = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  history.replaceState(null, "", location.pathname);
});

describe("CarouselClient hydration and presentation", () => {
  it("does not autoplay after hydrating content that already has focus", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    const props = {
      id: "focused-hydration",
      "aria-label": "Gallery",
      items,
      autoplay: { delay: 1000 },
    };
    const container = document.createElement("div");
    document.body.append(container);
    container.innerHTML = renderToString(<CarouselClient {...props} />);
    const focused = container.querySelector<HTMLButtonElement>("button")!;
    focused.focus();
    let hydrated: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      hydrated = hydrateRoot(container, <CarouselClient {...props} />);
    });
    deliver();
    expect(screen.getByRole("button", { name: "Start slide rotation" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(5000));
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();
    act(() => focused.blur());
    act(() => vi.advanceTimersByTime(5000));
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Start slide rotation" }));
    act(() => vi.advanceTimersByTime(1000));
    deliver();
    expect(Element.prototype.scrollBy).toHaveBeenCalledOnce();
    act(() => hydrated!.unmount());
  });

  it("keeps autoplay stopped when enabled while slide content is focused", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }));
    const props = { id: "focused-toggle", "aria-label": "Gallery", items };
    const { rerender } = render(<CarouselClient {...props} />);
    deliver();
    const focused = screen.getByRole<HTMLButtonElement>("button", { name: "One content" });
    act(() => focused.focus());
    rerender(<CarouselClient {...props} autoplay={{ delay: 1000 }} />);
    expect(screen.getByRole("button", { name: "Start slide rotation" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(5000));
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();
    act(() => focused.blur());
    act(() => vi.advanceTimersByTime(5000));
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Start slide rotation" }));
    act(() => vi.advanceTimersByTime(1000));
    deliver();
    expect(Element.prototype.scrollBy).toHaveBeenCalledOnce();
  });

  it("retains native SSR links without a false current dot and only reveals controls when ready", () => {
    const props = { id: "g", "aria-label": "Gallery", items };
    const html = renderToString(<CarouselClient {...props} />);
    expect(html).not.toContain("aria-current");
    expect(html).toMatch(/<button[^>]*data-carousel-action="previous"[^>]*hidden=""/);
    const { container } = render(<CarouselClient {...props} />);
    expect(screen.getByRole("link", { name: "Go to Two" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Next slide" })).toBeNull();
    deliver(100);
    expect(container.querySelector('[aria-current="true"]')?.textContent).toBe("2");
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Previous slide" }).disabled).toBe(
      false,
    );
    expect(
      container
        .querySelector('[data-carousel-index="0"][data-uiify-carousel-slide]')
        ?.hasAttribute("inert"),
    ).toBe(false);
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();
  });
  it("deduplicates end pages after readiness while preserving a focused duplicate dot until blur", () => {
    const { container } = render(<CarouselClient id="g" aria-label="Gallery" items={items} />);
    const dot = screen.getByRole("link", { name: "Go to Three" });
    act(() => dot.focus());
    deliver(100, 200);
    expect(document.activeElement).toBe(dot);
    expect(screen.getByRole("link", { name: "Go to Three" })).toBe(dot);
    act(() => screen.getByRole("button", { name: "Previous slide" }).focus());
    expect(screen.queryByRole("link", { name: "Go to Three" })).toBeNull();
    expect(container.querySelectorAll("[data-uiify-carousel-dot]")).toHaveLength(2);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Next slide" }).disabled).toBe(
      true,
    );
  });
  it("keeps a dot focused through real hydration without recoverable errors", async () => {
    const props = { id: "g", "aria-label": "Gallery", items };
    const container = document.createElement("div");
    document.body.append(container);
    container.innerHTML = renderToString(<CarouselClient {...props} />);
    expect(container.querySelector("[data-uiify-carousel-slide-nav]")).toBeNull();
    const dot = container.querySelector<HTMLAnchorElement>("[data-uiify-carousel-dot]")!;
    dot.focus();
    const errors: unknown[] = [];
    let hydrated: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      hydrated = hydrateRoot(container, <CarouselClient {...props} />, {
        onRecoverableError: (error) => errors.push(error),
      });
    });
    deliver(100);
    expect(document.activeElement).toBe(dot);
    expect(errors).toEqual([]);
    act(() => hydrated!.unmount());
  });
  it("updates existing controller for controlled values and item changes and keeps rewind controls usable", () => {
    const { rerender, container, unmount } = render(
      <CarouselClient id="g" aria-label="Gallery" items={items} rewind />,
    );
    deliver();
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Previous slide" }).disabled).toBe(
      false,
    );
    rerender(<CarouselClient id="g" aria-label="Gallery" items={items} value={1} rewind />);
    deliver();
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith({ left: 100, behavior: "auto" });
    fireEvent(container.querySelector("[data-uiify-carousel-viewport]")!, new Event("scrollend"));
    deliver(100);
    expect(container.querySelector('[aria-current="true"]')?.textContent).toBe("2");
    rerender(
      <CarouselClient id="g" aria-label="Gallery" items={items.slice(0, 2)} value={1} rewind />,
    );
    deliver(100, 100, 2);
    expect(screen.queryByRole("link", { name: "Go to Three" })).toBeNull();
    expect(observation.destroy).not.toHaveBeenCalled();
    unmount();
    expect(observation.destroy).toHaveBeenCalledOnce();
  });
  it("exposes commands on the client handle and validates indices", () => {
    const ref = createRef<CarouselClientHandle>();
    const { container } = render(
      <CarouselClient id="g" aria-label="Gallery" items={items} ref={ref} />,
    );
    deliver();
    act(() => ref.current?.next());
    deliver();
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith({ left: 100, behavior: "auto" });
    fireEvent(container.querySelector("[data-uiify-carousel-viewport]")!, new Event("scrollend"));
    deliver(100);
    expect(() =>
      renderToString(<CarouselClient id="bad" aria-label="Bad" items={items} value={NaN} />),
    ).toThrow("valid item index");
  });

  it("lets an existing fragment win over default selection without rewriting history", () => {
    history.replaceState(null, "", "#g--slide-two");
    render(<CarouselClient id="g" aria-label="Gallery" items={items} defaultValue={2} />);
    deliver();
    expect(Element.prototype.scrollBy).not.toHaveBeenCalled();
    expect(location.hash).toBe("#g--slide-two");
  });

  it("reconciles a declined controlled scroll after reporting the actual settled selection", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <CarouselClient id="g" aria-label="Gallery" items={items} value={0} onSelect={onSelect} />,
    );
    deliver();
    const viewport = container.querySelector("[data-uiify-carousel-viewport]")!;
    fireEvent(viewport, new Event("scroll"));
    fireEvent(viewport, new Event("scrollend"));
    deliver(100);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(1, {
      previousIndex: 0,
      index: 1,
      reason: "scroll",
    });
    deliver(100);
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith({ left: -100, behavior: "auto" });
    fireEvent(viewport, new Event("scrollend"));
    deliver();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[aria-current="true"]')?.textContent).toBe("1");
  });
});
