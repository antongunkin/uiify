import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Toggle } from "./Toggle.js";

describe("Toggle", () => {
  it("renders a native checkbox and label", () => {
    render(<Toggle id="bold" defaultPressed label="Bold" />);

    expect((screen.getByRole("checkbox", { name: "Bold" }) as HTMLInputElement).checked).toBe(true);
  });

  it("lets the native checkbox own the pressed state", () => {
    render(<Toggle id="bold" label="Bold" />);
    const toggle = screen.getByRole("checkbox", { name: "Bold" });

    fireEvent.click(toggle);

    expect((toggle as HTMLInputElement).checked).toBe(true);
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Toggle id="bold" defaultPressed label="Bold" />);
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('for="bold"');
  });
});
