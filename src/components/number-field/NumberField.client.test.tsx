import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./NumberField.js";

describe("NumberField client", () => {
  it.each(["abc", "12abc"])("rejects %s without replacing the committed value", (text) => {
    const onValueChange = vi.fn();
    render(
      <NumberField.Root defaultValue={5} onValueChange={onValueChange}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: text } });
    expect(input.value).toBe("5");
    fireEvent.blur(input);
    expect(input.value).toBe("5");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("preserves partial numeric edits until a number is committed", () => {
    render(
      <NumberField.Root defaultValue={5}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.focus(input);
    for (const value of ["", "-", "1.", "1.5"]) {
      fireEvent.change(input, { target: { value } });
      expect(input.value).toBe(value);
    }
    fireEvent.blur(input);
    expect(input.value).toBe("1.5");
  });
  it("steps with arrow keys and exposes spinbutton aria values", () => {
    const onChange = vi.fn();
    render(
      <NumberField.Root defaultValue={5} min={0} max={10} step={1} onValueChange={onChange}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );

    const input = screen.getByRole("spinbutton", { name: "Amount" });
    expect(input.getAttribute("aria-valuenow")).toBe("5");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(6);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it("supports PageUp, PageDown, Home, and End", () => {
    const onChange = vi.fn();
    render(
      <NumberField.Root defaultValue={5} min={0} max={100} step={1} onValueChange={onChange}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );

    const input = screen.getByRole("spinbutton", { name: "Amount" });
    fireEvent.keyDown(input, { key: "PageUp" });
    expect(onChange).toHaveBeenCalledWith(15);

    fireEvent.keyDown(input, { key: "PageDown" });
    expect(onChange).toHaveBeenLastCalledWith(5);

    fireEvent.keyDown(input, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(0);

    fireEvent.keyDown(input, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("formats and parses locale-aware currency values", () => {
    const onChange = vi.fn();
    render(
      <NumberField.Root
        defaultValue={1234.5}
        formatOptions={{ style: "currency", currency: "USD" }}
        onValueChange={onChange}
      >
        <NumberField.Input aria-label="Price" />
      </NumberField.Root>,
    );

    const input = screen.getByRole("spinbutton", { name: "Price" }) as HTMLInputElement;
    expect(input.value).toContain("1");
    expect(input.value).toContain("234");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "2500" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(2500);
  });

  it("clamps on blur when enabled", () => {
    const onChange = vi.fn();
    render(
      <NumberField.Root defaultValue={5} min={0} max={10} clampValueOnBlur onValueChange={onChange}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );

    const input = screen.getByRole("spinbutton", { name: "Amount" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("increments and decrements via buttons", () => {
    const onChange = vi.fn();
    render(
      <NumberField.Root defaultValue={2} onValueChange={onChange}>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Decrease" />
          <NumberField.Input aria-label="Amount" />
          <NumberField.Increment aria-label="Increase" />
        </NumberField.Group>
      </NumberField.Root>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("reflects controlled value", () => {
    const { rerender } = render(
      <NumberField.Root value={4}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );

    expect(screen.getByRole("spinbutton", { name: "Amount" }).getAttribute("aria-valuenow")).toBe(
      "4",
    );

    rerender(
      <NumberField.Root value={7}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    expect(screen.getByRole("spinbutton", { name: "Amount" }).getAttribute("aria-valuenow")).toBe(
      "7",
    );
  });
});

it("edits formatted percentages using the formatter scale", () => {
  const change = vi.fn();
  render(
    <NumberField.Root
      defaultValue={0.5}
      formatOptions={{ style: "percent" }}
      onValueChange={change}
    >
      <NumberField.Input aria-label="Percentage" />
    </NumberField.Root>,
  );
  const input = screen.getByRole("spinbutton", { name: "Percentage" });
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "75%" } });
  fireEvent.blur(input);
  expect(change).toHaveBeenCalledWith(0.75);
  expect((input as HTMLInputElement).value).toBe("75%");
});
