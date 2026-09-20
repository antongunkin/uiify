import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { ToggleGroup } from "./ToggleGroup.js";

describe("ToggleGroup", () => {
  it("renders native controls for each item", () => {
    render(
      <ToggleGroup
        defaultValue="left"
        id="align"
        items={[
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ]}
        type="single"
      />,
    );
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
    expect(screen.getByLabelText("Left")).toBeTruthy();
  });

  it("renders a labeled single-selection radiogroup and disables every item", () => {
    render(
      <ToggleGroup
        aria-label="Text alignment"
        disabled
        id="align"
        items={[{ value: "left", label: "Left" }]}
        type="single"
      />,
    );

    const root = screen.getByRole("radiogroup", { name: "Text alignment" });
    expect(root.hasAttribute("data-disabled")).toBe(true);
    expect(
      (screen.getByRole("radio", { name: "Left", hidden: true }) as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it("uses the default value in the server markup", () => {
    const markup = assertSSRRenderable(
      <ToggleGroup
        aria-labelledby="alignment-label"
        id="align"
        items={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ]}
        type="single"
        defaultValue="center"
      />,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-labelledby="alignment-label"');
    expect(markup).toContain('id="align-control-center"');
    expect(markup).toMatch(/id="align-control-center"[^>]*checked/);
    expect(markup).not.toMatch(/id="align-control-left"[^>]*checked/);
  });

  it("reports the selected value from the client entry", async () => {
    const { ToggleGroupClient } = await import("./client/ToggleGroupClient.js");
    const onChange = vi.fn();

    render(
      <ToggleGroupClient
        id="align"
        items={[
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ]}
        onChange={onChange}
        type="single"
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Right", hidden: true }));
    expect(onChange).toHaveBeenCalledWith("right");
  });

  it("reports all selected values for a multiple client group", async () => {
    const { ToggleGroupClient } = await import("./client/ToggleGroupClient.js");
    const onChange = vi.fn();

    render(
      <ToggleGroupClient
        defaultValue={["bold"]}
        id="format"
        items={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
        ]}
        onChange={onChange}
        type="multiple"
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Italic", hidden: true }));
    expect(onChange).toHaveBeenCalledWith(["bold", "italic"]);
  });

  it("updates controlled multiple selections from the client entry", async () => {
    const { ToggleGroupClient } = await import("./client/ToggleGroupClient.js");
    const { rerender } = render(
      <ToggleGroupClient
        id="format"
        items={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
        ]}
        type="multiple"
        value={["bold"]}
      />,
    );

    rerender(
      <ToggleGroupClient
        id="format"
        items={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
        ]}
        type="multiple"
        value={["italic"]}
      />,
    );

    expect(
      (screen.getByRole("checkbox", { name: "Bold", hidden: true }) as HTMLInputElement).checked,
    ).toBe(false);
    expect(
      (screen.getByRole("checkbox", { name: "Italic", hidden: true }) as HTMLInputElement).checked,
    ).toBe(true);
  });
});
