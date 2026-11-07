import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxClient } from "./client/CheckboxClient.js";

describe("CheckboxClient", () => {
  it("reports native changes through onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    render(<CheckboxClient id="terms" label="Terms" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Terms" }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders a real mixed native checkbox", () => {
    render(<CheckboxClient checked="indeterminate" id="all" label="Select all" />);

    const checkbox = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.getAttribute("aria-checked")).toBe("mixed");
    expect(checkbox.getAttribute("data-state")).toBe("indeterminate");
    expect(checkbox.hasAttribute("checked")).toBe(false);
  });

  it("keeps a controlled indeterminate checkbox mixed after interaction", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxClient
        checked="indeterminate"
        id="all"
        label="Select all"
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    fireEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox.indeterminate).toBe(true);
  });

  it("clears the mixed property when the controlled value becomes boolean", () => {
    const { rerender } = render(
      <CheckboxClient checked="indeterminate" id="all" label="Select all" />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);

    rerender(<CheckboxClient checked id="all" label="Select all" />);
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });
});
