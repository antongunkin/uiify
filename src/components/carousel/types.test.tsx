import { expect, it } from "vitest";
import type { CarouselClientProps, CarouselProps, CarouselWithRefProps } from "./types.js";

it("accepts native props and refs for generated carousel parts", () => {
  const base: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [{ id: "one", label: "One", children: "Slide one" }],
    title: "Gallery title",
    onChange: () => {},
    "data-testid": "gallery",
    slotProps: {
      viewport: { className: "viewport", "data-testid": "viewport" },
      slide: { byItemValue: { one: { "data-testid": "slide-one" } } },
      slideContent: { byItemValue: { one: { className: "slide-content" } } },
      previousControl: { "data-testid": "previous" },
      nextControl: { "data-testid": "next" },
      dots: { className: "dots" },
      dot: { byItemValue: { one: { "data-testid": "dot-one" } } },
      status: { "data-testid": "status" },
    },
  };
  const withRef: CarouselWithRefProps = { ...base, ref: (node) => void node };
  const client: CarouselClientProps = { ...base, autoplay: true };
  const invalidMode: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    "data-mode": "fade",
  };
  const invalidDangerousHtml: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    // @ts-expect-error Carousel always renders its own children.
    dangerouslySetInnerHTML: { __html: "unsafe" },
  };
  const invalidViewportHtml: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    // @ts-expect-error Generated viewport children cannot be replaced.
    slotProps: { viewport: { dangerouslySetInnerHTML: { __html: "unsafe" } } },
  };

  expect([
    withRef.id,
    client.id,
    invalidMode.id,
    invalidDangerousHtml.id,
    invalidViewportHtml.id,
  ]).toHaveLength(5);
});

it("accepts native slide, navigation and control overrides", () => {
  const invalidSlideId: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    slotProps: { slide: { id: "other" } },
  };
  const invalidDotHref: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    slotProps: { dot: { href: "#other" } },
  };
  const invalidControlAction: CarouselProps = {
    id: "gallery",
    "aria-label": "Gallery",
    items: [],
    slotProps: { nextControl: { "data-carousel-action": "previous" } },
  };

  expect([invalidSlideId, invalidDotHref, invalidControlAction].length).toBe(3);
});
