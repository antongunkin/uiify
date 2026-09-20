import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { SegmentedControl } from "./SegmentedControl.js";

describe("SegmentedControl", () => {
  it("renders radios and labels for each segment", () => {
    render(
      <SegmentedControl
        defaultValue="day"
        id="range"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
      />,
    );
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
    expect(screen.getByLabelText("Day")).toBeTruthy();
  });

  it("renders a labeled radiogroup and disables every segment", () => {
    render(
      <SegmentedControl
        aria-label="Date range"
        disabled
        id="range"
        items={[{ value: "day", label: "Day" }]}
      />,
    );

    const root = screen.getByRole("radiogroup", { name: "Date range" });
    expect(root.hasAttribute("data-disabled")).toBe(true);
    expect(
      (screen.getByRole("radio", { name: "Day", hidden: true }) as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it("uses the default value and full-width marker in the server markup", () => {
    const markup = assertSSRRenderable(
      <SegmentedControl
        aria-labelledby="range-label"
        defaultValue="week"
        fullWidth
        id="range"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
      />,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-labelledby="range-label"');
    expect(markup).toContain("data-full-width");
    expect(markup).toMatch(/id="range-control-week"[^>]*checked/);
    expect(markup).not.toMatch(/id="range-control-day"[^>]*checked/);
  });

  it("reports the selected value from the client entry", async () => {
    const { SegmentedControlClient } = await import("./client/SegmentedControlClient.js");
    const onChange = vi.fn();

    render(
      <SegmentedControlClient
        defaultValue="day"
        id="range"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Week", hidden: true }));
    expect(onChange).toHaveBeenCalledWith("week");
  });

  it("updates the selected radio when a client value changes", async () => {
    const { SegmentedControlClient } = await import("./client/SegmentedControlClient.js");
    const { rerender } = render(
      <SegmentedControlClient
        id="range"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
        value="day"
      />,
    );

    rerender(
      <SegmentedControlClient
        id="range"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
        value="week"
      />,
    );

    expect(
      (screen.getByRole("radio", { name: "Week", hidden: true }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByRole("radio", { name: "Day", hidden: true }) as HTMLInputElement).checked,
    ).toBe(false);
  });
});
