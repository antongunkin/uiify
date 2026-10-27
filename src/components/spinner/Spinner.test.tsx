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

  it("uses the translated default unless the legacy label prop is provided", () => {
    const { rerender } = render(<Spinner labels={{ loading: "Chargement" }} showLabel />);
    expect(screen.getByRole("status", { name: "Chargement" })).toBeTruthy();
    expect(screen.getByText("Chargement")).toBeTruthy();
    rerender(<Spinner label="Fetching" labels={{ loading: "Chargement" }} />);
    expect(screen.getByRole("status", { name: "Fetching" })).toBeTruthy();
  });

  it("forwards className to the root element", () => {
    render(<Spinner className="docs-spinner docs-spinner--small" />);
    expect(screen.getByRole("status").className).toBe("docs-spinner docs-spinner--small");
  });

  it("renders a static progressbar when value is set", () => {
    render(<Spinner label="Usage" value={140} />);
    const bar = screen.getByRole("progressbar", { name: "Usage" });
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
    expect(bar.getAttribute("data-value")).toBe("100");
    expect(bar.getAttribute("aria-live")).toBeNull();
  });

  it("renders a visible label when showLabel is true", () => {
    render(<Spinner label="Loading content" showLabel />);
    const status = screen.getByRole("status", { name: "Loading content" });

    const visibleLabel = status.querySelector('[data-part="label"]');
    expect(visibleLabel?.getAttribute("data-part")).toBe("label");
    expect(visibleLabel?.textContent).toBe("Loading content");
  });

  it("forwards slot props to the generated visible label", () => {
    render(
      <Spinner
        showLabel
        slotProps={{ label: { className: "spinner-label", "data-testid": "spinner-label" } }}
      />,
    );
    const label = screen.getByTestId("spinner-label");
    expect(label.className).toBe("spinner-label");
    expect(label.getAttribute("data-part")).toBe("label");
  });

  it("exposes the reference loader sizes and alignment without SVG markup", () => {
    render(<Spinner size="sm" align="center" />);
    const status = screen.getByRole("status");

    expect(status.getAttribute("data-size")).toBe("sm");
    expect(status.getAttribute("data-align")).toBe("center");
    expect(status.querySelector("svg")).toBeNull();
  });

  it("defaults to the middle size and can render as a span", () => {
    render(<Spinner as="span" />);
    const status = screen.getByRole("status");

    expect(status.tagName).toBe("SPAN");
    expect(status.getAttribute("data-size")).toBe("md");
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
