import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Carousel } from "./Carousel.js";
import { CarouselMarkup } from "./CarouselMarkup.js";
import type { CarouselPresentation } from "./types.js";

const twoItems = [
  { id: "one", label: "One", children: <p>First</p> },
  { id: "two", label: "Two", children: <p>Second</p> },
] as const;

const readyPresentation: CarouselPresentation = {
  mode: "scroll",
  snapshot: {
    ready: true,
    index: 1,
    requestedIndex: null,
    settledChange: null,
    pages: [
      { index: 0, offset: 0 },
      { index: 1, offset: 100 },
    ],
    visibleIndices: [1],
    atStart: false,
    atEnd: true,
    moving: false,
    interacting: false,
  },
  preserveFallbackFocus: false,
  mounted: true,
};

describe("Carousel server renderer", () => {
  it("renders usable fragment destinations without current-state fiction", () => {
    render(<Carousel id="g" aria-label="Gallery" items={twoItems} />);

    const gallery = screen.getByRole("region", { name: "Gallery" });
    expect(within(gallery).getByRole("link", { name: "Go to Two" }).getAttribute("href")).toBe(
      "#g--slide-two",
    );
    expect(gallery.querySelector("#g--slide-two")?.textContent).toContain("Second");
    expect(gallery.querySelector("[aria-current]")).toBeNull();
    expect(gallery.querySelector("[role=tab]")).toBeNull();
  });

  it("ships empty navigation buttons that take their visible content from icons", () => {
    const base = { id: "icons", "aria-label": "Icons", items: twoItems };
    const { rerender } = render(<CarouselMarkup base={base} presentation={readyPresentation} />);
    // Named by labels, but the component supplies no glyph of its own.
    expect(screen.getByRole("button", { name: "Previous slide" }).textContent).toBe("");

    rerender(
      <CarouselMarkup
        base={{ ...base, icons: { previous: <span data-testid="chevron">←</span> } }}
        presentation={readyPresentation}
      />,
    );
    const previous = screen.getByRole("button", { name: "Previous slide" });
    expect(previous.querySelector('[data-testid="chevron"]')?.textContent).toBe("←");
  });

  it("renders null for no items and omits redundant controls for one item", () => {
    const { container, rerender } = render(<Carousel id="empty" aria-label="Empty" items={[]} />);
    expect(container.innerHTML).toBe("");

    rerender(
      <Carousel
        id="single"
        aria-label="Single"
        items={[{ id: "only", label: "Only", children: "Only content" }]}
      />,
    );
    expect(container.querySelector("[data-uiify-carousel-slide-nav]")).toBeNull();
    expect(container.querySelector("[data-uiify-carousel-dots]")).toBeNull();
    expect(screen.getByRole("group", { name: "Only, 1 of 1" })).toBeTruthy();
  });

  it("rejects invalid and duplicate ids while allowing encoded Unicode fragments", () => {
    expect(() =>
      render(
        <Carousel
          id="duplicate"
          aria-label="Duplicate"
          items={[
            { id: "same", label: "One", children: "One" },
            { id: "same", label: "Two", children: "Two" },
          ]}
        />,
      ),
    ).toThrow(/duplicate.*same/i);
    expect(() =>
      render(
        <Carousel
          id="bad root"
          aria-label="Bad"
          items={[{ id: "one", label: "One", children: "One" }]}
        />,
      ),
    ).toThrow(/id.*whitespace/i);
    expect(() =>
      render(
        <Carousel
          id="bad"
          aria-label="Bad"
          items={[{ id: "has space", label: "One", children: "One" }]}
        />,
      ),
    ).toThrow(/item.*whitespace/i);

    render(
      <Carousel
        id="галерея"
        aria-label="Unicode"
        items={[
          { id: "один", label: "Один", children: "Первый" },
          { id: "二", label: "二", children: "第二" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Go to 二" }).getAttribute("href")).toBe(
      "#%D0%B3%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F--slide-%E4%BA%8C",
    );
    expect(document.getElementById("галерея--slide-二")).toBeTruthy();
  });

  it("keeps ids scoped across two carousels and nested carousel markup", () => {
    render(
      <>
        <Carousel id="first" aria-label="First gallery" items={twoItems} />
        <Carousel
          id="outer"
          aria-label="Outer gallery"
          items={[
            {
              id: "nested",
              label: "Nested",
              children: <Carousel id="inner" aria-label="Inner gallery" items={twoItems} />,
            },
          ]}
        />
      </>,
    );

    expect(document.getElementById("first--slide-two")).toBeTruthy();
    expect(document.getElementById("inner--slide-two")).toBeTruthy();
    expect(screen.getAllByRole("region")).toHaveLength(3);
    const outer = screen.getByRole("region", { name: "Outer gallery" });
    expect(outer.querySelector(":scope > [data-uiify-carousel-viewport]")?.children).toHaveLength(
      1,
    );
  });

  it("forwards localized labels, direction, styles and every class slot", () => {
    render(
      <CarouselMarkup
        base={{
          id: "styled",
          "aria-label": "Styled gallery",
          items: [
            { id: "one", label: "One", className: "item", children: "One" },
            { id: "two", label: "Two", children: "Two" },
          ],
          dir: "rtl",
          className: "root",
          classNames: {
            viewport: "viewport",
            slide: "slide",
            slideContent: "content",
            controls: "controls",
            previous: "previous",
            next: "next",
            dots: "dots",
            dot: "dot",
            rotation: "rotation",
            status: "status",
          },
          style: { "--uiify-carousel-gap": "2rem" },
          labels: {
            previous: "Назад",
            next: "Вперёд",
            goTo: "Перейти к",
            navigation: "Выберите слайд",
            start: "Запустить",
            stop: "Остановить",
            of: "из",
          },
        }}
        presentation={{
          ...readyPresentation,
          autoplay: { requested: true, playing: true, completedAdvances: 0 },
        }}
      />,
    );

    const root = screen.getByRole("region", { name: "Styled gallery" });
    expect(root.classList.contains("root")).toBe(true);
    expect(root.getAttribute("dir")).toBe("rtl");
    expect((root as HTMLElement).style.getPropertyValue("--uiify-carousel-gap")).toBe("2rem");
    expect(root.querySelector(".viewport")).toBeTruthy();
    expect(root.querySelector(".slide.item")).toBeTruthy();
    expect(root.querySelector(".content")).toBeTruthy();
    expect(root.querySelector(".controls")).toBeTruthy();
    expect(within(root).getByRole("button", { name: "Назад" }).classList.contains("previous")).toBe(
      true,
    );
    expect(within(root).getByRole("button", { name: "Вперёд" }).classList.contains("next")).toBe(
      true,
    );
    expect(
      within(root).getByRole("link", { name: "Перейти к One" }).classList.contains("dot"),
    ).toBe(true);
    expect(
      within(root).getByRole("button", { name: "Остановить" }).classList.contains("rotation"),
    ).toBe(true);
    expect(root.querySelector(".status")).toBeTruthy();
    expect(root.querySelector("[aria-label='One, 1 из 2']")).toBeTruthy();
  });

  it("produces deterministic handler-free server markup", () => {
    const first = renderToString(<Carousel id="ssr" aria-label="SSR gallery" items={twoItems} />);
    const second = renderToString(<Carousel id="ssr" aria-label="SSR gallery" items={twoItems} />);

    expect(first).toBe(second);
    expect(first).toContain('href="#ssr--slide-two"');
    expect(first).not.toMatch(/on(?:click|pointer|key|scroll)=/i);

    for (const file of ["Carousel.tsx", "CarouselMarkup.tsx", "carousel-markup.ts"]) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      expect(source).not.toMatch(/["']use client["']/);
      expect(source).not.toMatch(/from ["']\.\/client\//);
      expect(source).not.toMatch(/\buse(?:State|Effect|LayoutEffect|Ref|Memo|Callback|Context)\b/);
    }
  });
});
