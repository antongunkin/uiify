import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Breadcrumb } from "./Breadcrumb.js";

describe("Breadcrumb", () => {
  it("preserves custom navigation labels and styling overrides", () => {
    render(
      <Breadcrumb.Root aria-label="Location" data-uiify-breadcrumb="override">
        <Breadcrumb.List data-part="override">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            <Breadcrumb.Separator />
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(
      screen.getByRole("navigation", { name: "Location" })?.getAttribute("data-uiify-breadcrumb"),
    ).toBe("override");
    expect(screen.getByRole("list")?.getAttribute("data-part")).toBe("override");
    expect(screen.getByRole("link")?.getAttribute("data-part")).toBe("link");
  });

  it("renders nav > ol > li structure", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs" current>
              Docs
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("uses label defaults and lets aria-label override the root label", () => {
    const { rerender } = render(<Breadcrumb.Root labels={{ root: "Навигация" }} />);
    expect(screen.getByRole("navigation", { name: "Навигация" })).toBeTruthy();
    rerender(<Breadcrumb.Root aria-label="Location" labels={{ root: "Навигация" }} />);
    expect(screen.getByRole("navigation", { name: "Location" })).toBeTruthy();
  });

  it("sets aria-current=page on current link", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs" current>
              Docs
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("aria-current")).toBe("page");
  });

  it("renders separator as aria-hidden", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText("/").getAttribute("aria-hidden")).toBe("true");
  });

  it("accepts current-link native overrides", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs" current aria-current="step" data-current="bogus">
              Docs
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("aria-current")).toBe("step");
    expect(link.getAttribute("data-current")).toBe("bogus");
  });

  it("accepts separator native overrides", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Separator aria-hidden={false}>/</Breadcrumb.Separator>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText("/").getAttribute("aria-hidden")).toBe("false");
  });

  it("throws when maxItems is given without the data-driven items prop", () => {
    expect(() =>
      render(
        <Breadcrumb.Root>
          <Breadcrumb.List maxItems={4}>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/1">One</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>,
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
      <Breadcrumb.Root>
        <Breadcrumb.List
          items={items}
          itemsAfterCollapse={1}
          itemsBeforeCollapse={1}
          maxItems={4}
        />
      </Breadcrumb.Root>,
    );
    expect(screen.getByLabelText("Show collapsed breadcrumbs")).toBeTruthy();
    expect(screen.getByRole("link", { name: "One" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Five" })).toBeTruthy();
    expect(container.querySelector("li li")).toBeNull();
  });

  it("allows the collapsed breadcrumbs summary label to be translated", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List
          items={[
            { key: "1", label: "One" },
            { key: "2", label: "Two" },
            { key: "3", label: "Three" },
          ]}
          labels={{ root: "Breadcrumb", showCollapsed: "Afficher les éléments masqués" }}
          maxItems={2}
        />
      </Breadcrumb.Root>,
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
      <Breadcrumb.Root>
        <Breadcrumb.List
          items={routeSegments.map(toItemData)}
          separator={<Breadcrumb.Separator>/</Breadcrumb.Separator>}
        />
      </Breadcrumb.Root>,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "One" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Two" })).toBeTruthy();
    // Separator renders between items but not after the last one.
    expect(screen.getAllByText("/")).toHaveLength(1);
  });

  it("routes generated item and link props by each item's key", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List
          items={[
            { href: "/", key: "home", label: "Home" },
            { current: true, href: "/docs", key: "docs", label: "Docs" },
          ]}
          slotProps={{
            item: { byItemValue: { docs: { className: "docs-item", "data-testid": "docs-item" } } },
            link: { byItemValue: { docs: { className: "docs-link", "data-testid": "docs-link" } } },
          }}
        />
      </Breadcrumb.Root>,
    );

    expect(screen.getByTestId("docs-item").classList.contains("docs-item")).toBe(true);
    expect(screen.getByTestId("docs-link").classList.contains("docs-link")).toBe(true);
    expect(screen.getByTestId("docs-link").getAttribute("href")).toBe("/docs");
    expect(screen.getByTestId("docs-link").getAttribute("aria-current")).toBe("page");
  });

  it("routes props to the collapsed wrapper, disclosure and hidden item links", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List
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
      </Breadcrumb.Root>,
    );

    expect(screen.getByTestId("ellipsis-item").tagName).toBe("LI");
    expect(screen.getByTestId("ellipsis-details").classList.contains("ellipsis-details")).toBe(
      true,
    );
    expect(screen.getByTestId("ellipsis-trigger").tagName).toBe("SUMMARY");
    expect(screen.getByTestId("ellipsis-content").tagName).toBe("OL");
    expect(screen.getByTestId("hidden-link").getAttribute("href")).toBe("/one");
  });

  it("lets the standalone ellipsis style its generated list item and glyph", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Ellipsis
            slotProps={{
              item: { className: "ellipsis-item", "data-testid": "standalone-ellipsis-item" },
              ellipsis: { className: "ellipsis-glyph", "data-testid": "standalone-ellipsis-glyph" },
            }}
          />
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );

    expect(screen.getByTestId("standalone-ellipsis-item").classList.contains("ellipsis-item")).toBe(
      true,
    );
    expect(
      screen.getByTestId("standalone-ellipsis-glyph").classList.contains("ellipsis-glyph"),
    ).toBe(true);
  });

  it("marks the current item from data-driven items", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List items={[{ current: true, href: "/docs", key: "1", label: "Docs" }]} />
      </Breadcrumb.Root>,
    );
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("aria-current")).toBe("page");
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(html).toContain('aria-label="Breadcrumb"');
  });
});
