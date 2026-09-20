import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DirectionProvider, useDirection } from "./direction.js";
import { VisuallyHidden } from "./visually-hidden.js";

function DirectionReader() {
  return <output>{useDirection()}</output>;
}
DirectionReader.displayName = "DirectionReader";

describe("small primitives", () => {
  it("renders VisuallyHidden through a polymorphic element", () => {
    render(<VisuallyHidden as="button">Hidden action</VisuallyHidden>);
    const button = screen.getByRole("button", { name: "Hidden action" });
    expect(button.style.position).toBe("absolute");
    expect(button.style.clipPath).toBe("inset(50%)");
  });

  it("owns the hiding styles, not overridable by a consumer's conflicting style", () => {
    render(
      <VisuallyHidden as="button" style={{ color: "red", position: "static" }}>
        Hidden action
      </VisuallyHidden>,
    );
    const button = screen.getByRole("button", { name: "Hidden action" });
    // Owned hiding styles win even though the consumer tried to defeat them.
    expect(button.style.position).toBe("absolute");
    expect(button.style.clipPath).toBe("inset(50%)");
    // A consumer's unrelated inline style survives the join.
    expect(button.style.color).toBe("red");
  });

  it("reads a stable direction provider", () => {
    render(
      <DirectionProvider dir="rtl">
        <DirectionReader />
      </DirectionProvider>,
    );
    expect(screen.getByText("rtl")).toBeTruthy();
  });
});
