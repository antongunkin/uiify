import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Pagination } from "./Pagination.js";
import { PaginationRoot as StaticPagination } from "./PaginationShell.js";

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

it("preserves default pagination DOM", () => {
  expect({
    client: outline(renderToStaticMarkup(<Pagination.Root count={10} page={5} showFirstLast />)),
    static: outline(
      renderToStaticMarkup(
        <StaticPagination
          count={10}
          page={5}
          showFirstLast
          getPageHref={(page) => `/page/${page}`}
        />,
      ),
    ),
  }).toMatchSnapshot();
});

it("lets native props replace pagination defaults including undefined and per-item values", () => {
  render(
    <Pagination.Root
      count={10}
      page={5}
      aria-label={undefined}
      data-uiify-pagination="custom"
      slotProps={{
        link: {
          "aria-label": undefined,
          byItemValue: {
            "page:5": {
              "aria-current": "date",
              type: "submit",
              "data-type": "custom",
              "data-testid": "page",
            },
          },
        },
        control: {
          byItemValue: {
            next: {
              disabled: true,
              type: "submit",
              "aria-label": "Continue",
              "data-testid": "next",
            },
          },
        },
        ellipsis: { "aria-hidden": false, "data-type": "gap", "data-testid": "gap" },
      }}
    />,
  );
  expect(screen.getByRole("navigation").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByRole("navigation").getAttribute("data-uiify-pagination")).toBe("custom");
  expect(screen.getByTestId("page").getAttribute("aria-current")).toBe("date");
  expect(screen.getByTestId("page").hasAttribute("aria-label")).toBe(false);
  expect(screen.getByTestId("page").getAttribute("type")).toBe("submit");
  expect(screen.getByTestId("next").getAttribute("type")).toBe("submit");
  expect(screen.getByTestId("next").getAttribute("aria-label")).toBe("Continue");
  expect(screen.getByTestId("next").hasAttribute("disabled")).toBe(true);
  expect(screen.getAllByTestId("gap")[0]?.getAttribute("aria-hidden")).toBe("false");
});
