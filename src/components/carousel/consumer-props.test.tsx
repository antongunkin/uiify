import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Carousel } from "./Carousel.js";
import { CarouselMarkup } from "./CarouselMarkup.js";
import type { CarouselPresentation } from "./types.js";
function outline(html: string): string[] {
  const host = document.createElement("div");
  host.innerHTML = html;
  return [...host.querySelectorAll("*")].map((element) =>
    `${element.localName} ${[...element.attributes]
      .map((attribute) => `${attribute.name}="${attribute.value}"`)
      .sort()
      .join(" ")}`.trim(),
  );
}

const items = [
  { id: "one", label: "One", children: "First" },
  { id: "two", label: "Two", children: "Second" },
];
const presentation: CarouselPresentation = {
  mode: "fade",
  mounted: true,
  preserveFallbackFocus: false,
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
};
it("preserves default carousel DOM", () => {
  expect({
    static: outline(
      renderToStaticMarkup(<Carousel id="gallery" aria-label="Gallery" items={items} />),
    ),
    enhanced: outline(
      renderToStaticMarkup(
        <CarouselMarkup
          base={{ id: "gallery", "aria-label": "Gallery", items }}
          presentation={presentation}
        />,
      ),
    ),
  }).toMatchSnapshot();
});

it("lets native carousel props override state, links, semantics and generated slide values", () => {
  render(
    <CarouselMarkup
      base={{
        id: "gallery",
        "aria-label": "Gallery",
        items,
        "data-mode": "custom",
        "data-enhanced": undefined,
        "aria-roledescription": undefined,
        slotProps: {
          viewport: {
            id: "custom-viewport",
            tabIndex: -1,
            role: "list",
            "data-testid": "viewport",
          },
          slide: {
            id: "custom-slide",
            "aria-hidden": false,
            "data-state": "custom",
            "data-testid": "slide",
          },
          dot: { href: "#custom-slide", "aria-current": "step", "data-testid": "dot" },
          nextControl: { type: "submit", disabled: false, hidden: true, "data-testid": "next" },
          status: { "aria-live": "assertive", "data-testid": "status" },
        },
      }}
      presentation={presentation}
    />,
  );
  expect(screen.getByRole("region").getAttribute("data-mode")).toBe("custom");
  expect(screen.getByRole("region").hasAttribute("data-enhanced")).toBe(false);
  expect(screen.getByRole("region").hasAttribute("aria-roledescription")).toBe(false);
  expect(screen.getByTestId("viewport").getAttribute("role")).toBe("list");
  expect(screen.getAllByTestId("slide")[0]?.getAttribute("aria-hidden")).toBe("false");
  expect(screen.getAllByTestId("dot")[0]?.getAttribute("href")).toBe("#custom-slide");
  expect(screen.getByTestId("next").getAttribute("type")).toBe("submit");
  expect(screen.getByTestId("next").hasAttribute("disabled")).toBe(false);
  expect(screen.getByTestId("status").getAttribute("aria-live")).toBe("assertive");
});
