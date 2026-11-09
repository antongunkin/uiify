import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Header } from "./Header.js";

describe("Header", () => {
  it("renders a semantic header with static placement by default", () => {
    render(<Header>Site navigation</Header>);
    const root = screen.getByRole("banner");
    expect(root.tagName).toBe("HEADER");
    expect(root.classList.contains("uiify-header")).toBe(true);
    expect(root.hasAttribute("data-uiify-header")).toBe(false);
    expect(root.getAttribute("data-placement")).toBe("static");
    expect(root.textContent).toBe("Site navigation");
  });

  it("preserves consumer attributes", () => {
    render(
      <Header
        data-testid="root"
        placement="sticky"
        data-uiify-header="fake"
        data-placement="fake"
      />,
    );
    const root = screen.getByTestId("root");
    expect(root.getAttribute("data-uiify-header")).toBe("fake");
    expect(root.getAttribute("data-placement")).toBe("fake");
  });

  it("forwards native attributes, consumer styling, data attributes, and events", () => {
    const onClick = vi.fn();
    render(
      <Header
        id="site-header"
        aria-label="Site"
        className="custom-header"
        style={{ color: "red" }}
        data-consumer="value"
        onClick={onClick}
      />,
    );
    const root = screen.getByRole("banner", { name: "Site" });
    expect(root.id).toBe("site-header");
    expect(root.className).toBe("uiify-header custom-header");
    expect(root.style.color).toBe("red");
    expect(root.getAttribute("data-consumer")).toBe("value");
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards the ref to the native header", () => {
    const ref = createRef<HTMLElement>();
    render(<Header ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("banner"));
  });

  it("renders semantic markup on the server", () => {
    const html = assertSSRRenderable(
      <Header placement="sticky">
        <nav aria-label="Main">
          <a href="/docs">Docs</a>
        </nav>
      </Header>,
    );
    expect(html).toContain("<header");
    expect(html).toContain('data-placement="sticky"');
    expect(html).toContain('href="/docs"');
  });

  it("is a plain component, not a namespace object", () => {
    expect(typeof Header).toBe("function");
  });
});
