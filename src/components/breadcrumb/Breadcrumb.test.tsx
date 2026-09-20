import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Breadcrumb } from "./Breadcrumb.js";

describe("Breadcrumb", () => {
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

  it("owns aria-current and data-current on the current link; consumer cannot override them", () => {
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
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.getAttribute("data-current")).toBe("");
  });

  it("owns aria-hidden on the separator; consumer cannot override it", () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Separator aria-hidden={false}>/</Breadcrumb.Separator>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText("/").getAttribute("aria-hidden")).toBe("true");
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
