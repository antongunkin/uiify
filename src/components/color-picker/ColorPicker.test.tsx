import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createColor } from "./color.js";
import { ColorPicker } from "./ColorPicker.js";

describe("ColorPicker", () => {
  it("updates hue via slider", () => {
    const onChange = vi.fn();
    render(
      <ColorPicker.Root
        defaultValue={createColor({ r: 255, g: 0, b: 0, a: 1 })}
        onChange={onChange}
      >
        <ColorPicker.Slider channel="hue" />
      </ColorPicker.Root>,
    );

    const slider = screen.getByRole("slider", { name: "hue" });
    fireEvent.change(slider, { target: { value: "120" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("selects a swatch", () => {
    const onChange = vi.fn();
    render(
      <ColorPicker.Root onChange={onChange}>
        <ColorPicker.SwatchGroup swatches={["#ff0000", "#00ff00"]} />
      </ColorPicker.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "#00ff00" }));
    expect(onChange).toHaveBeenCalledWith(createColor({ r: 0, g: 255, b: 0, a: 1 }));
  });

  it("renders formatted field value", () => {
    render(
      <ColorPicker.Root defaultValue={createColor({ r: 255, g: 0, b: 0, a: 1 })}>
        <ColorPicker.Field />
      </ColorPicker.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Color value" }).getAttribute("value")).toBe(
      "#ff0000",
    );
  });
});
