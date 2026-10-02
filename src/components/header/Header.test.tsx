import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Header } from "./Header.js";

describe("Header.Root", () => {
  it("renders a semantic header with static placement by default", () => {
    render(<Header.Root>Site navigation</Header.Root>);
    const root = screen.getByRole("banner");
    expect(root.tagName).toBe("HEADER");
    expect(root.getAttribute("data-uiify-header")).toBe("");
    expect(root.getAttribute("data-placement")).toBe("static");
    expect(root.textContent).toBe("Site navigation");
  });

  it("owns its identity and placement attributes", () => {
    render(
      <Header.Root
        data-testid="root"
        placement="sticky"
        data-uiify-header="fake"
        data-placement="fake"
      />,
    );
    const root = screen.getByTestId("root");
    expect(root.getAttribute("data-uiify-header")).toBe("");
    expect(root.getAttribute("data-placement")).toBe("sticky");
  });

  it("forwards native attributes, consumer styling, data attributes, and events", () => {
    const onClick = vi.fn();
    render(
      <Header.Root
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
    expect(root.className).toBe("custom-header");
    expect(root.style.color).toBe("red");
    expect(root.getAttribute("data-consumer")).toBe("value");
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards the ref to the native header", () => {
    const ref = createRef<HTMLElement>();
    render(<Header.Root ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("banner"));
  });

  it("renders semantic markup on the server", () => {
    const html = assertSSRRenderable(
      <Header.Root placement="sticky">
        <nav aria-label="Main">
          <a href="/docs">Docs</a>
        </nav>
      </Header.Root>,
    );
    expect(html).toContain("<header");
    expect(html).toContain('data-placement="sticky"');
    expect(html).toContain('href="/docs"');
  });

  it("exposes only the Root compound part", () => {
    expect(Object.keys(Header)).toEqual(["Root"]);
  });
});
