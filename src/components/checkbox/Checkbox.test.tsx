import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Checkbox } from "./Checkbox.js";

describe("Checkbox", () => {
  it("renders a native checkbox and label from data props", () => {
    render(<Checkbox id="terms" label="Accept terms" defaultChecked />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox.getAttribute("id")).toBe("terms");
    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });

  it("renders a server-readable indeterminate state", () => {
    render(<Checkbox id="all" label="Select all" checked="indeterminate" />);
    const checkbox = screen.getByRole("checkbox", { name: "Select all" });

    expect(checkbox.getAttribute("data-state")).toBe("indeterminate");
    expect(checkbox.getAttribute("aria-checked")).toBe("mixed");
  });

  it("maps disabled through to the native input", () => {
    render(<Checkbox id="terms" label="Terms" disabled />);
    expect((screen.getByRole("checkbox", { name: "Terms" }) as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it("keeps the consumer class on the label and exposes the identity marker", () => {
    render(<Checkbox id="terms" label="Terms" className="custom-checkbox" />);

    const checkbox = screen.getByRole("checkbox", { name: "Terms" });
    expect(checkbox.className).toBe("");
    expect(checkbox.parentElement?.className).toBe("custom-checkbox");
    expect(checkbox.parentElement?.getAttribute("data-uiify-checkbox")).toBe("");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Checkbox id="terms" label="Terms" defaultChecked />);
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('aria-labelledby="terms-label"');
    expect(markup).toContain('id="terms-label"');
  });
});
