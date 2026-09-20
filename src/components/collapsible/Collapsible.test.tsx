import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { Collapsible } from "./Collapsible.js";

describe("Collapsible", () => {
  it("renders a details/summary pair, no input", () => {
    render(<Collapsible content={<>Filter body</>} defaultOpen id="filters" label="Filters" />);

    expect(document.querySelector("details")).toBeTruthy();
    expect(screen.getByText("Filters").tagName).toBe("SUMMARY");
    expect(document.querySelector("input")).toBeNull();
  });

  it("marks a disabled summary aria-disabled and unfocusable, not the input", () => {
    render(<Collapsible content={<>Filter body</>} disabled id="filters" label="Filters" />);

    const summary = screen.getByText("Filters");
    expect(summary.getAttribute("aria-disabled")).toBe("true");
    expect(summary.getAttribute("tabindex")).toBe("-1");
    expect(summary.closest("details")?.hasAttribute("data-disabled")).toBe(true);
  });

  it("renders open state and panel wiring in SSR markup", () => {
    const html = assertSSRRenderable(
      <Collapsible content={<>Visible</>} defaultOpen id="filters" label="Filters" />,
    );
    expect(html).toContain("<details");
    expect(html).toContain('id="filters"');
    expect(html).toContain('open=""');
    expect(html).toContain("<summary");
    expect(html).not.toContain("<input");
  });
});
