import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb.js";

describe("Breadcrumb", () => {
  it("preserves custom navigation labels and styling overrides", () => {
    render(
      <Breadcrumb aria-label="Location" data-uiify-breadcrumb="override">
        <BreadcrumbList data-part="override">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation", { name: "Location" }).className).toBe("uiify-breadcrumb");
    expect(
      screen.getByRole("navigation", { name: "Location" }).getAttribute("data-uiify-breadcrumb"),
    ).toBe("override");
    expect(screen.getByRole("list")?.getAttribute("data-part")).toBe("override");
    expect(screen.getByRole("link")?.classList.contains("uiify-breadcrumb-link")).toBe(true);
  });

  it("renders nav > ol > li structure", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("uses label defaults and lets aria-label override the root label", () => {
    const { rerender } = render(<Breadcrumb labels={{ root: "Навигация" }} />);
    expect(screen.getByRole("navigation", { name: "Навигация" })).toBeTruthy();
    rerender(<Breadcrumb aria-label="Location" labels={{ root: "Навигация" }} />);
    expect(screen.getByRole("navigation", { name: "Location" })).toBeTruthy();
  });

  it("renders the current page as a span with aria-current=page, not a link", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const page = screen.getByText("Docs");
    expect(page.localName).toBe("span");
    expect(page.getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders separator as aria-hidden", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const separator = screen.getByText("/");
    expect(separator.localName).toBe("li");
    expect(separator.getAttribute("aria-hidden")).toBe("true");
  });

  it("accepts current-page native overrides", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage aria-current="step" data-current="bogus">
              Docs
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const page = screen.getByText("Docs");
    expect(page.getAttribute("aria-current")).toBe("step");
    expect(page.getAttribute("data-current")).toBe("bogus");
  });

  it("accepts separator native overrides", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator aria-hidden={false}>/</BreadcrumbSeparator>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByText("/").getAttribute("aria-hidden")).toBe("false");
  });

  it("throws when maxItems is given without the data-driven items prop", () => {
    expect(() =>
      render(
        <Breadcrumb>
          <BreadcrumbList maxItems={4}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/1">One</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      ),
    ).toThrow(/maxItems requires the data-driven `items` prop/);
  });

  it("collapses middle items when maxItems exceeded, from a data-driven items array", () => {
    const items = [
      { key: "1", href: "/1", label: "One" },
      { key: "2", href: "/2", label: "Two" },
      { key: "3", href: "/3", label: "Three" },
      { key: "4", href: "/4", label: "Four" },
      { key: "5", href: "/5", label: "Five", current: true },
    ];
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList items={items} itemsAfterCollapse={1} itemsBeforeCollapse={1} maxItems={4} />
      </Breadcrumb>,
    );
    expect(screen.getByLabelText("Show collapsed breadcrumbs")).toBeTruthy();
    expect(screen.getByRole("link", { name: "One" })).toBeTruthy();
    expect(screen.getByText("Five").getAttribute("aria-current")).toBe("page");
    // Hidden links sit in their own list items inside the disclosure's list, never directly in an li.
    expect(container.querySelector("li > li")).toBeNull();
  });

  it("allows the collapsed breadcrumbs summary label to be translated", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList
          items={[
            { key: "1", label: "One" },
            { key: "2", label: "Two" },
            { key: "3", label: "Three" },
          ]}
          labels={{ root: "Breadcrumb", showCollapsed: "Afficher les éléments masqués" }}
          maxItems={2}
        />
      </Breadcrumb>,
    );
    expect(screen.getByLabelText("Afficher les éléments masqués")).toBeTruthy();
  });

  it("renders every item from a data-driven items array, generated from a .map() through a wrapper component — no child traversal to break", () => {
    const routeSegments = [
      { id: "1", href: "/1", title: "One" },
      { id: "2", href: "/2", title: "Two" },
    ];

    function toItemData(segment: (typeof routeSegments)[number]) {
      return { key: segment.id, href: segment.href, label: segment.title };
    }

    render(
      <Breadcrumb>
        <BreadcrumbList items={routeSegments.map(toItemData)} separator="/" />
      </Breadcrumb>,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "One" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Two" })).toBeTruthy();
    // Separator renders between items but not after the last one.
    expect(screen.getAllByText("/")).toHaveLength(1);
  });

  it("routes generated item and link props by each item's key", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList
          items={[
            { href: "/", key: "home", label: "Home" },
            { current: true, href: "/docs", key: "docs", label: "Docs" },
          ]}
          slotProps={{
            item: { byItemValue: { docs: { className: "docs-item", "data-testid": "docs-item" } } },
            link: { byItemValue: { home: { className: "home-link", "data-testid": "home-link" } } },
            page: { byItemValue: { docs: { className: "docs-page", "data-testid": "docs-page" } } },
          }}
        />
      </Breadcrumb>,
    );

    expect(screen.getByTestId("docs-item").classList.contains("docs-item")).toBe(true);
    expect(screen.getByTestId("home-link").classList.contains("home-link")).toBe(true);
    expect(screen.getByTestId("home-link").getAttribute("href")).toBe("/");
    expect(screen.getByTestId("docs-page").classList.contains("docs-page")).toBe(true);
    expect(screen.getByTestId("docs-page").getAttribute("aria-current")).toBe("page");
  });

  it("routes props to the collapsed wrapper, disclosure and hidden item links", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList
          items={[
            { href: "/", key: "home", label: "Home" },
            { href: "/one", key: "one", label: "One" },
            { href: "/two", key: "two", label: "Two" },
            { current: true, href: "/docs", key: "docs", label: "Docs" },
          ]}
          itemsAfterCollapse={1}
          itemsBeforeCollapse={1}
          maxItems={3}
          slotProps={{
            ellipsisItem: { "data-testid": "ellipsis-item" },
            ellipsis: { className: "ellipsis-details", "data-testid": "ellipsis-details" },
            ellipsisTrigger: { className: "ellipsis-trigger", "data-testid": "ellipsis-trigger" },
            ellipsisContent: { "data-testid": "ellipsis-content" },
            link: {
              byItemValue: { one: { "data-testid": "hidden-link" } },
            },
          }}
        />
      </Breadcrumb>,
    );

    expect(screen.getByTestId("ellipsis-item").tagName).toBe("LI");
    expect(screen.getByTestId("ellipsis-details").classList.contains("ellipsis-details")).toBe(
      true,
    );
    expect(screen.getByTestId("ellipsis-trigger").tagName).toBe("SUMMARY");
    expect(screen.getByTestId("ellipsis-content").tagName).toBe("OL");
    expect(screen.getByTestId("hidden-link").getAttribute("href")).toBe("/one");
  });

  it("renders the standalone ellipsis as a hidden span the consumer places in an item", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem data-testid="standalone-ellipsis-item">
            <BreadcrumbEllipsis
              className="ellipsis-glyph"
              data-testid="standalone-ellipsis-glyph"
            />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const glyph = screen.getByTestId("standalone-ellipsis-glyph");
    expect(glyph.localName).toBe("span");
    expect(glyph.getAttribute("aria-hidden")).toBe("true");
    expect(glyph.classList.contains("ellipsis-glyph")).toBe(true);
    expect(glyph.parentElement).toBe(screen.getByTestId("standalone-ellipsis-item"));
  });

  it("marks the current item from data-driven items", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList items={[{ current: true, href: "/docs", key: "1", label: "Docs" }]} />
      </Breadcrumb>,
    );
    const page = screen.getByText("Docs");
    expect(page.localName).toBe("span");
    expect(page.getAttribute("aria-current")).toBe("page");
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(html).toContain('aria-label="Breadcrumb"');
  });
});
