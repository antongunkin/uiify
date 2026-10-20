import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker.js";

describe("DatePicker", () => {
  it("renders a native date input and preserves native props and ref", () => {
    const ref = vi.fn();
    render(
      <DatePicker
        ref={ref}
        id="start-date"
        name="startDate"
        defaultValue="2026-10-19"
        min="2026-01-01"
        required
        aria-label="Start date"
        className="consumer-date"
        data-layout="compact"
      />,
    );

    const input = screen.getByLabelText("Start date") as HTMLInputElement;
    expect(input.type).toBe("date");
    expect(input.name).toBe("startDate");
    expect(input.value).toBe("2026-10-19");
    expect(input.min).toBe("2026-01-01");
    expect(input.required).toBe(true);
    expect(input.className).toBe("consumer-date");
    expect(input.getAttribute("data-layout")).toBe("compact");
    expect(input.getAttribute("data-uiify-date-picker")).toBe("");
    expect(ref).toHaveBeenCalledWith(input);
  });

  it("owns invalid and disabled state markers", () => {
    render(
      <DatePicker
        aria-label="Delivery date"
        invalid
        disabled
        aria-invalid={false}
        data-invalid="consumer"
        data-disabled="consumer"
        data-uiify-date-picker="consumer"
      />,
    );

    const input = screen.getByLabelText("Delivery date");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("data-invalid")).toBe("");
    expect(input.getAttribute("data-disabled")).toBe("");
    expect(input.getAttribute("data-uiify-date-picker")).toBe("");
  });

  it("preserves consumer aria-invalid when the component invalid prop is unset", () => {
    render(<DatePicker aria-label="Date" aria-invalid="grammar" />);
    expect(screen.getByLabelText("Date").getAttribute("aria-invalid")).toBe("grammar");
  });
});
