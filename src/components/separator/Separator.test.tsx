import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./Separator.js";

describe("Separator", () => {
  it("renders a horizontal hr without aria-orientation", () => {
    render(<Separator data-testid="line" />);
    const line = screen.getByTestId("line");
    expect(line.tagName).toBe("HR");
    expect(line.className).toBe("uiify-separator");
    expect(line.getAttribute("data-orientation")).toBe("horizontal");
    expect(line.hasAttribute("aria-orientation")).toBe(false);
    expect(screen.getByRole("separator")).toBe(line);
  });

  it("sets aria-orientation for a vertical separator", () => {
    render(<Separator orientation="vertical" />);
    const line = screen.getByRole("separator");
    expect(line.getAttribute("data-orientation")).toBe("vertical");
    expect(line.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("forwards ref, merges className and lets consumer attributes win", () => {
    const ref = createRef<HTMLHRElement>();
    const decorative = { role: "none", "aria-orientation": undefined } as const;
    render(
      <Separator
        ref={ref}
        orientation="vertical"
        className="mine"
        data-testid="line"
        {...decorative}
      />,
    );
    const line = screen.getByTestId("line");
    expect(ref.current).toBe(line);
    expect(line.className).toBe("uiify-separator mine");
    expect(line.getAttribute("role")).toBe("none");
    expect(line.hasAttribute("aria-orientation")).toBe(false);
  });
});
