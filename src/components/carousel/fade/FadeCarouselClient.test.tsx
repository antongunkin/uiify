import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { CarouselClientHandle } from "../types.js";
import { FadeCarouselClient } from "./FadeCarouselClient.js";

const items = ["One", "Two", "Three"].map((label) => ({
  id: label,
  label,
  children: <button>{label} content</button>,
}));
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  Element.prototype.getAnimations = () => [];
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("SSR is a readable scroller and hydrated fade transitions update accessibility immediately", async () => {
  const props = { id: "g", "aria-label": "Gallery", items };
  const html = renderToString(<FadeCarouselClient {...props} />);
  expect(html).not.toContain("inert");
  expect(html).not.toContain("data-enhanced");
  const { container } = render(<FadeCarouselClient {...props} />);
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(
    container.querySelector('[data-part="slide"][data-carousel-index="0"]')!.hasAttribute("inert"),
  ).toBe(true);
  expect(
    container
      .querySelector('[data-part="slide"][data-carousel-index="1"]')!
      .getAttribute("aria-hidden"),
  ).toBeNull();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(20);
  });
  expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe("true");
});
it("shares autoplay and exposes immediate stop/start/reset on its handle", async () => {
  const ref = createRef<CarouselClientHandle>();
  render(
    <FadeCarouselClient
      id="g"
      aria-label="Gallery"
      items={items}
      autoplay={{ delay: 100 }}
      ref={ref}
    />,
  );
  act(() => ref.current?.stop());
  await act(async () => {
    await vi.advanceTimersByTimeAsync(150);
  });
  expect(screen.getByRole("link", { name: "Go to One" }).getAttribute("aria-current")).toBe("true");
  act(() => ref.current?.start());
  await act(async () => {
    await vi.advanceTimersByTimeAsync(120);
  });
  expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe("true");
  act(() => {
    ref.current?.reset();
    ref.current?.stop();
  });
});
it("reconciles a rejected controlled selection without echoing it", async () => {
  const onSelect = vi.fn();
  render(
    <FadeCarouselClient id="g" aria-label="Gallery" items={items} value={0} onSelect={onSelect} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(20);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(20);
  });
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("link", { name: "Go to One" }).getAttribute("aria-current")).toBe("true");
});

function AcceptedSelection() {
  const [value, setValue] = useState(0);
  return (
    <FadeCarouselClient
      id="g"
      aria-label="Gallery"
      items={items}
      value={value}
      onSelect={setValue}
    />
  );
}
AcceptedSelection.displayName = "AcceptedSelection";

it("keeps an accepted controlled selection without starting a return transition", async () => {
  const { container } = render(<AcceptedSelection />);
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(20);
  });
  expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe("true");
  expect(
    container
      .querySelector('[data-part="slide"][data-carousel-index="1"]')!
      .getAttribute("data-state"),
  ).toBe("active");
  await act(async () => {
    await vi.advanceTimersByTimeAsync(20);
  });
  expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe("true");
});

it.each(["touch", "pen"])(
  "enables %s swipe by default and honors an explicit opt-out",
  async (pointerType) => {
    const { container, rerender } = render(
      <FadeCarouselClient id="g" aria-label="Gallery" items={items} />,
    );
    const viewport = container.querySelector<HTMLElement>('[data-part="viewport"]')!;
    viewport.setPointerCapture = vi.fn();
    viewport.hasPointerCapture = () => true;
    viewport.releasePointerCapture = vi.fn();
    function swipe() {
      for (const [type, clientX] of [
        ["pointerdown", 200],
        ["pointermove", 0],
        ["pointerup", 0],
      ] as const) {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.assign(event, {
          pointerId: 1,
          pointerType,
          button: 0,
          buttons: type === "pointerup" ? 0 : 1,
          clientX,
          clientY: 0,
          isPrimary: true,
        });
        fireEvent(viewport, event);
      }
    }
    swipe();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });
    expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe(
      "true",
    );
    rerender(<FadeCarouselClient id="g" aria-label="Gallery" items={items} swipe={false} />);
    vi.mocked(viewport.setPointerCapture).mockClear();
    swipe();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });
    expect(viewport.setPointerCapture).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Go to Two" }).getAttribute("aria-current")).toBe(
      "true",
    );
  },
);
