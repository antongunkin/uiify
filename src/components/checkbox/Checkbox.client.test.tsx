import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox.js";

describe("Checkbox client enhancement", () => {
  it("reports native changes through onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="terms" label="Terms" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Terms" }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("keeps a controlled indeterminate checkbox mixed after interaction", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
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
});
