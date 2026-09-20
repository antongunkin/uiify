import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Pagination } from "./Pagination.js";
import {
  PaginationEllipsis as PaginationShellEllipsis,
  PaginationLink as PaginationShellLink,
  PaginationRoot as PaginationShellRoot,
} from "./PaginationShell.js";

describe("Pagination", () => {
  it("renders nav with list of page controls", () => {
    render(<Pagination.Root count={5} page={1} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
  });

  it("sets aria-current on selected page", () => {
    render(<Pagination.Root count={5} page={3} />);
    expect(screen.getByLabelText("Page 3").getAttribute("aria-current")).toBe("page");
  });

  it("renders page buttons for interactive pagination", () => {
    render(<Pagination.Root count={5} page={3} />);
    expect(screen.getByRole("button", { name: "Page 3" })).toBeTruthy();
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(<Pagination.Root count={3} page={1} />);
    expect(html).toContain('aria-label="Pagination"');
  });

  it("Root owns data-uiify-pagination; consumer cannot override it", () => {
    render(<Pagination.Root count={3} page={1} data-uiify-pagination="bogus" />);
    expect(screen.getByRole("navigation").getAttribute("data-uiify-pagination")).toBe("");
  });

  it("Link owns aria-current, aria-label, data-selected, and data-type; consumer cannot override them", () => {
    render(
      <Pagination.Root count={5} page={1}>
        <Pagination.Link
          page={2}
          selected
          aria-current="date"
          aria-label="bogus"
          data-selected="bogus"
          data-type="bogus"
        />
      </Pagination.Root>,
    );
    const link = screen.getByRole("button", { name: "Page 2" });
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.getAttribute("data-selected")).toBe("");
    expect(link.getAttribute("data-type")).toBe("page");
  });

  describe("PaginationShell (static getPageHref-driven variant)", () => {
    it("Root owns data-uiify-pagination; consumer cannot override it", () => {
      render(
        <PaginationShellRoot count={3} page={1} data-uiify-pagination="bogus" data-testid="nav" />,
      );
      expect(screen.getByTestId("nav").getAttribute("data-uiify-pagination")).toBe("");
    });

    it("Link owns aria-current, aria-label, data-selected, and data-type; consumer cannot override them", () => {
      render(
        <PaginationShellLink
          page={2}
          selected
          getPageHref={(page) => `/page/${page}`}
          aria-current="date"
          aria-label="bogus"
          data-selected="bogus"
          data-type="bogus"
        />,
      );
      const link = screen.getByRole("link", { name: "Page 2" });
      expect(link.getAttribute("aria-current")).toBe("page");
      expect(link.getAttribute("data-selected")).toBe("");
      expect(link.getAttribute("data-type")).toBe("page");
    });

    it("Ellipsis owns aria-hidden and data-type; consumer cannot override them", () => {
      render(
        <PaginationShellEllipsis aria-hidden="false" data-type="bogus" data-testid="ellipsis" />,
      );
      const ellipsis = screen.getByTestId("ellipsis");
      expect(ellipsis.getAttribute("aria-hidden")).toBe("true");
      expect(ellipsis.getAttribute("data-type")).toBe("ellipsis");
    });
  });
});
