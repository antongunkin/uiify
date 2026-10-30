import { readFileSync } from "node:fs";
import { createRef } from "react";
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
    settledIndex: 1,
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
  it("forwards native root props and its element ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Carousel
        id="native-root"
        aria-label="Gallery"
        items={twoItems}
        title="Native carousel"
        data-testid="native-carousel"
        ref={ref}
      />,
    );

    expect(screen.getByTestId("native-carousel").getAttribute("title")).toBe("Native carousel");
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("lets consumers replace generated carousel state markers", () => {
    const { container } = render(
      <Carousel
        id="custom-state"
        aria-label="Gallery"
        items={twoItems}
        data-mode="custom"
        data-enhanced="custom"
      />,
    );
    expect(container.querySelector("section")?.getAttribute("data-mode")).toBe("custom");
    expect(container.querySelector("section")?.getAttribute("data-enhanced")).toBe("custom");
  });

  it("forwards slotProps to its generated controls, viewport, slides and dots", () => {
    render(
      <CarouselMarkup
        base={{
          id: "slots",
          "aria-label": "Slot gallery",
          title: "Gallery title",
          "data-testid": "carousel-root",
          items: twoItems,
          slotProps: {
            viewport: { className: "viewport", "data-testid": "carousel-viewport" },
            slide: {
              className: "slide",
              byItemValue: { two: { "data-testid": "slide-two" } },
            },
            slideContent: {
              byItemValue: { two: { className: "slide-content", "data-testid": "content-two" } },
            },
            previousControl: { "data-testid": "previous-control" },
            nextControl: { "data-testid": "next-control" },
            dots: { className: "dots", "data-testid": "carousel-dots" },
            dot: { byItemValue: { two: { className: "dot", "data-testid": "dot-two" } } },
          },
        }}
        presentation={readyPresentation}
      />,
    );

    expect(screen.getByTestId("carousel-root").getAttribute("title")).toBe("Gallery title");
    expect(screen.getByTestId("carousel-viewport").className).toContain("viewport");
    expect(screen.getByTestId("slide-two").className).toContain("slide");
    expect(screen.getByTestId("content-two").className).toContain("slide-content");
    expect(screen.getByTestId("previous-control").getAttribute("data-carousel-action")).toBe(
      "previous",
    );
    expect(screen.getByTestId("next-control").getAttribute("data-carousel-action")).toBe("next");
    expect(screen.getByTestId("carousel-dots").className).toContain("dots");
    expect(screen.getByTestId("dot-two").getAttribute("href")).toBe("#slots--slide-two");
  });

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
    expect(container.querySelector('[data-part="slide-nav"]')).toBeNull();
    expect(container.querySelector('[data-part="dots"]')).toBeNull();
    expect(screen.getByRole("group", { name: "Only, 1 of 1" })).toBeTruthy();
  });

  it("preserves ungrouped English numbers in default slide labels", () => {
    const items = Array.from({ length: 1000 }, (_, index) => ({
      id: String(index),
      label: `Slide ${index + 1}`,
      children: `Content ${index + 1}`,
    }));
    render(<Carousel id="many" aria-label="Many slides" items={items} />);

    expect(screen.getByRole("group", { name: "Slide 1000, 1000 of 1000" })).toBeTruthy();
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
    expect(outer.querySelector(':scope > [data-part="viewport"]')?.children).toHaveLength(1);
  });

  it("forwards root and item classes and exposes public parts through data-part", () => {
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
          style: { "--uiify-carousel-gap": "2rem" },
          labels: {
            previous: "Назад",
            next: "Вперёд",
            goToSlide: "Перейти к {label}",
            slide: "{label}, {index} из {count}",
            navigation: "Выберите слайд",
            start: "Запустить",
            stop: "Остановить",
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
    expect(root.querySelector(':scope > [data-part="viewport"]')).toBeTruthy();
    expect(
      root.querySelector(':scope > [data-part="viewport"] > [data-part="slide"].item'),
    ).toBeTruthy();
    expect(root.querySelector('[data-part="slide-content"]')).toBeTruthy();
    expect(
      root.querySelector('[data-part="controls"][data-carousel-action="previous"]'),
    ).toBeTruthy();
    expect(root.querySelector('[data-part="controls"][data-carousel-action="next"]')).toBeTruthy();
    expect(root.querySelector('[data-part="dot"]')).toBeTruthy();
    expect(
      root.querySelector('[data-part="controls"][data-carousel-action="rotation"]'),
    ).toBeTruthy();
    expect(root.querySelector('[data-part="status"]')).toBeTruthy();
    expect(root.querySelector("[aria-label='One, 1 из 2']")).toBeTruthy();
    expect(root.querySelector("[aria-label='Перейти к One']")).toBeTruthy();
  });

  it("formats slide and dot labels from localized templates", () => {
    const items = [
      { id: "one", label: "Intro", children: "First" },
      { id: "two", label: "Details", children: "Second" },
      { id: "three", label: "Finish", children: "Third" },
    ] as const;

    const { rerender } = render(<Carousel id="templates" aria-label="Templates" items={items} />);
    expect(screen.getByRole("group", { name: "Intro, 1 of 3" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Go to Intro" })).toBeTruthy();

    rerender(
      <Carousel
        id="templates"
        aria-label="Templates"
        items={items}
        locale="ja-JP"
        labels={{ slide: "{count}枚中{index}枚目: {label}" }}
      />,
    );
    expect(screen.getByRole("group", { name: "3枚中1枚目: Intro" })).toBeTruthy();

    rerender(
      <Carousel
        id="templates"
        aria-label="Templates"
        items={items}
        locale="ar-EG"
        labels={{ slide: "{label}، {index} من {count}" }}
      />,
    );
    expect(screen.getByRole("group", { name: "Intro، ١ من ٣" })).toBeTruthy();
  });

  it("uses the slide template for the live region announcement", () => {
    const items = [
      { id: "one", label: "Intro", children: "First" },
      { id: "two", label: "Details", children: "Second" },
      { id: "three", label: "Finish", children: "Third" },
    ] as const;

    render(
      <CarouselMarkup
        base={{
          id: "announcement",
          "aria-label": "Announcement",
          items,
          locale: "ja-JP",
          labels: { slide: "{count}枚中{index}枚目: {label}" },
        }}
        presentation={{
          ...readyPresentation,
          snapshot: { ...readyPresentation.snapshot, settledIndex: 2 },
        }}
      />,
    );

    expect(screen.getByText("3枚中3枚目: Finish")).toBeTruthy();
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
