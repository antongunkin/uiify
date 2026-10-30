import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
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

  it("marks a controlled checkbox read-only when no change handler is supplied", () => {
    render(<Toggle id="bold" label="Bold" pressed />);

    expect(screen.getByRole("checkbox", { name: "Bold" }).hasAttribute("readonly")).toBe(true);
  });

  it("reports controlled state changes without owning the state", () => {
    const onPressedChange = vi.fn();
    const onControlChange = vi.fn();
    const view = render(
      <Toggle
        id="bold"
        label="Bold"
        pressed={false}
        onPressedChange={onPressedChange}
        slotProps={{ control: { onChange: onControlChange } }}
      />,
    );
    const toggle = view.getByRole("checkbox", { name: "Bold" });
    expect(toggle.hasAttribute("readonly")).toBe(false);

    fireEvent.click(toggle);

    expect(onControlChange).toHaveBeenCalledOnce();
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect((toggle as HTMLInputElement).checked).toBe(false);

    view.rerender(<Toggle id="bold" label="Bold" pressed onPressedChange={onPressedChange} />);

    expect((toggle as HTMLInputElement).checked).toBe(true);
  });

  it("forwards root and generated control/label slot props", () => {
    const rootRef = createRef<HTMLDivElement>();
    const controlRef = createRef<HTMLInputElement>();
    const labelRef = createRef<HTMLLabelElement>();
    render(
      <Toggle
        ref={rootRef}
        className="toggle-root"
        id="italic"
        label="Italic"
        data-testid="toggle-root"
        slotProps={{
          control: {
            ref: controlRef,
            className: "toggle-control",
            "data-testid": "toggle-control",
          },
          label: { ref: labelRef, className: "toggle-label", "data-testid": "toggle-label" },
        }}
      />,
    );
    expect(rootRef.current).toBe(screen.getByTestId("toggle-root"));
    expect(controlRef.current).toBe(screen.getByTestId("toggle-control"));
    expect(labelRef.current).toBe(screen.getByTestId("toggle-label"));
    expect(screen.getByTestId("toggle-root").className).toBe("toggle-root");
    expect(screen.getByTestId("toggle-control").className).toBe("toggle-control");
    expect(screen.getByTestId("toggle-label").className).toBe("toggle-label");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Toggle id="bold" defaultPressed label="Bold" />);
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('for="bold"');
  });
});
