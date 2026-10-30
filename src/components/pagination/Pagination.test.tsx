import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Pagination } from "./Pagination.js";
import {
  PaginationEllipsis as PaginationShellEllipsis,
  PaginationLink as PaginationShellLink,
  PaginationRoot as PaginationShellRoot,
} from "./PaginationShell.js";

describe("Pagination", () => {
  it("forwards slotProps to generated list, item, page, control and ellipsis parts", () => {
    render(
      <Pagination.Root
        count={10}
        page={5}
        slotProps={{
          list: { className: "page-list", "data-testid": "page-list" },
          item: {
            className: "page-item",
            byItemValue: { "page:5": { "data-testid": "current-page-item" } },
          },
          link: { byItemValue: { "page:5": { "data-testid": "current-page-link" } } },
          control: { byItemValue: { next: { "data-testid": "next-page" } } },
          ellipsis: { className: "page-ellipsis", "data-testid": "page-ellipsis" },
        }}
      />,
    );

    expect(screen.getByTestId("page-list").className).toContain("page-list");
    expect(screen.getByTestId("current-page-item").className).toContain("page-item");
    expect(screen.getByTestId("current-page-link").getAttribute("aria-current")).toBe("page");
    expect(screen.getByTestId("next-page").getAttribute("data-type")).toBe("next");
    expect(screen.getAllByTestId("page-ellipsis")).toHaveLength(2);
    expect(screen.getAllByTestId("page-ellipsis")[0]?.className).toContain("page-ellipsis");
  });

  it("lets a generated control handler veto pagination while preserving the native event", () => {
    const onPageChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <Pagination.Root
        count={5}
        page={1}
        onPageChange={onPageChange}
        slotProps={{ control: { byItemValue: { next: { onClick } } } }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("renders nav with list of page controls", () => {
    render(<Pagination.Root count={5} page={1} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
  });

  it("uses labels for the navigation name and keeps the aria-label prop priority", () => {
    const { rerender } = render(<Pagination.Root count={3} page={1} labels={{ root: "Pages" }} />);
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeTruthy();

    rerender(
      <Pagination.Root count={3} page={1} labels={{ root: "Pages" }} aria-label="Results" />,
    );
    expect(screen.getByRole("navigation", { name: "Results" })).toBeTruthy();
  });

  it("sets aria-current on selected page", () => {
    render(<Pagination.Root count={5} page={3} />);
    const page = screen.getByLabelText("Page 3");
    expect(page.getAttribute("aria-current")).toBe("page");
    expect(page.textContent).toBe("3");
  });

  it("renders page buttons for interactive pagination", () => {
    render(<Pagination.Root count={5} page={3} />);
    expect(screen.getByRole("button", { name: "Page 3" })).toBeTruthy();
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(<Pagination.Root count={3} page={1} />);
    expect(html).toContain('aria-label="Pagination"');
  });

  it("allows root identity overrides", () => {
    render(<Pagination.Root count={3} page={1} data-uiify-pagination="bogus" />);
    expect(screen.getByRole("navigation").getAttribute("data-uiify-pagination")).toBe("bogus");
  });

  it("allows native link overrides", () => {
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
    const link = screen.getByRole("button", { name: "bogus" });
    expect(link.getAttribute("aria-current")).toBe("date");
    expect(link.getAttribute("data-selected")).toBe("bogus");
    expect(link.getAttribute("data-type")).toBe("bogus");
  });

  describe("PaginationShell (static getPageHref-driven variant)", () => {
    it("supports serializable label overrides and locale-formatted page numbers", () => {
      const labels = { next: "الصفحة التالية", page: "الصفحة {page}" };
      expect(JSON.parse(JSON.stringify(labels))).toEqual(labels);

      const html = assertSSRRenderable(
        <PaginationShellRoot
          count={5}
          page={4}
          locale="ar-EG"
          labels={labels}
          getPageHref={(page) => `/page/${page}`}
        />,
      );
      expect(html).toContain('aria-label="الصفحة التالية"');
      expect(html).toContain('aria-label="الصفحة ٤"');
      expect(html).toContain("٤");
      expect(html).toContain('href="/page/4"');
    });

    it("keeps the default page accessible name in English", () => {
      render(<PaginationShellRoot count={5} page={4} getPageHref={(page) => `/page/${page}`} />);
      expect(screen.getByRole("link", { name: "Page 4" })).toBeTruthy();
    });

    it("allows root identity overrides", () => {
      render(
        <PaginationShellRoot count={3} page={1} data-uiify-pagination="bogus" data-testid="nav" />,
      );
      expect(screen.getByTestId("nav").getAttribute("data-uiify-pagination")).toBe("bogus");
    });

    it("allows native link overrides", () => {
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
      const link = screen.getByRole("link", { name: "bogus" });
      expect(link.getAttribute("aria-current")).toBe("date");
      expect(link.getAttribute("data-selected")).toBe("bogus");
      expect(link.getAttribute("data-type")).toBe("bogus");
    });

    it("allows native ellipsis overrides", () => {
      render(
        <PaginationShellEllipsis aria-hidden="false" data-type="bogus" data-testid="ellipsis" />,
      );
      const ellipsis = screen.getByTestId("ellipsis");
      expect(ellipsis.getAttribute("aria-hidden")).toBe("false");
      expect(ellipsis.getAttribute("data-type")).toBe("bogus");
    });
  });
});
