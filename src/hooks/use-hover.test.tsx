import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { useHover } from "./use-hover.js";

function Probe() {
  const { isHovered, hoverProps } = useHover();
  return <div {...hoverProps} data-testid="box" data-hover={String(isHovered)} />;
}
Probe.displayName = "Probe";

describe("useHover", () => {
  it("toggles on pointerenter / pointerleave", () => {
    const { getByTestId } = render(<Probe />);
    const box = getByTestId("box");
    // React synthesizes onPointerEnter/Leave from native pointerover/pointerout.
    act(() => box.dispatchEvent(new MouseEvent("pointerover", { bubbles: true })));
    expect(box.getAttribute("data-hover")).toBe("true");
    act(() => box.dispatchEvent(new MouseEvent("pointerout", { bubbles: true })));
    expect(box.getAttribute("data-hover")).toBe("false");
  });

  it("ignores touch pointer events", () => {
    const { getByTestId } = render(<Probe />);
    const box = getByTestId("box");
    const touchEnter = new MouseEvent("pointerover", { bubbles: true });
    Object.defineProperty(touchEnter, "pointerType", { value: "touch" });

    act(() => box.dispatchEvent(touchEnter));

    expect(box.getAttribute("data-hover")).toBe("false");
  });
});
