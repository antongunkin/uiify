import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Spinner } from "./Spinner.js";

describe("Spinner", () => {
  it("renders role=status with accessible label", () => {
    render(<Spinner label="Fetching data" />);
    const status = screen.getByRole("status", { name: "Fetching data" });
    expect(status).toBeTruthy();
    expect(status.getAttribute("aria-label")).toBe("Fetching data");
  });

  it("is visible immediately when delay is 0", () => {
    render(<Spinner delay={0} />);
    const status = screen.getByRole("status");
    expect(status.getAttribute("data-state")).toBe("visible");
    expect(status.hasAttribute("hidden")).toBe(false);
  });

  it("marks delayed spinners for CSS visibility", () => {
    render(<Spinner delay={500} />);
    const status = screen.getByRole("status", { hidden: true });
    expect(status.getAttribute("data-state")).toBe("delayed");
    expect(status.getAttribute("data-delay")).toBe("500ms");
  });

  it("uses default Loading label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  });

  it("forwards className to the root element", () => {
    render(<Spinner className="docs-spinner docs-spinner--small" />);
    expect(screen.getByRole("status").className).toBe("docs-spinner docs-spinner--small");
  });

  it("renders a visible label when showLabel is true", () => {
    render(<Spinner label="Loading content" showLabel />);
    const status = screen.getByRole("status", { name: "Loading content" });

    const visibleLabel = status.querySelector('[data-part="label"]');
    expect(visibleLabel?.getAttribute("data-part")).toBe("label");
    expect(visibleLabel?.textContent).toBe("Loading content");
  });

  it("exposes the reference loader sizes and alignment without SVG markup", () => {
    render(<Spinner size="small" align="center" />);
    const status = screen.getByRole("status");

    expect(status.getAttribute("data-size")).toBe("small");
    expect(status.getAttribute("data-align")).toBe("center");
    expect(status.querySelector("svg")).toBeNull();
  });

  it("defaults to the middle size and can render as a span", () => {
    render(<Spinner as="span" />);
    const status = screen.getByRole("status");

    expect(status.tagName).toBe("SPAN");
    expect(status.getAttribute("data-size")).toBe("default");
  });

  it("SSR renders without throwing", () => {
    const html = assertSSRRenderable(<Spinner />);
    expect(html).toContain('role="status"');
  });

  it("owns aria-live, role and data attributes; consumer cannot override them", () => {
    render(
      <Spinner
        delay={500}
        role="alert"
        aria-live="assertive"
        data-uiify-spinner="bogus"
        data-state="visible"
        data-delay="bogus"
      />,
    );
    const status = screen.getByRole("status", { hidden: true });
    expect(status.getAttribute("role")).toBe("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("data-uiify-spinner")).toBe("");
    expect(status.getAttribute("data-state")).toBe("delayed");
    expect(status.getAttribute("data-delay")).toBe("500ms");
  });

  it("uses an accessible name without generated inline styles or hidden markup", () => {
    render(<Spinner delay={500} label="Loading content" />);
    const status = screen.getByRole("status", { name: "Loading content", hidden: true });

    expect(status.hasAttribute("style")).toBe(false);
    expect(status.querySelector("span")).toBeNull();
  });
});
