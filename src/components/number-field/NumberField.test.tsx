import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { NumberField } from "./NumberField.js";

describe("NumberField", () => {
  it("renders a spinbutton input contract before hydration", () => {
    render(
      <NumberField.Root defaultValue={5} min={0} max={10} step={2}>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Decrease" />
          <NumberField.Input aria-label="Amount" />
          <NumberField.Increment aria-label="Increase" />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
    expect(input.value).toBe("5");
  });

  it("renders controlled initial values plus disabled and readonly states in SSR markup", () => {
    const markup = renderToStaticMarkup(
      <NumberField.Root value={7} min={0} max={10} disabled readOnly required>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );

    expect(markup).toContain('role="spinbutton"');
    expect(markup).toContain('value="7"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('readonly=""');
    expect(markup).toContain('required=""');
  });

  it("owns data-disabled on Root regardless of a consumer override attempt", () => {
    const { container } = render(
      <NumberField.Root defaultValue={1} disabled data-disabled="nope">
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-disabled")).toBe("");
  });

  it("owns data-disabled on Group regardless of a consumer override attempt", () => {
    render(
      <NumberField.Root defaultValue={1}>
        <NumberField.Group data-disabled="nope" data-testid="group">
          <NumberField.Input aria-label="Amount" />
        </NumberField.Group>
      </NumberField.Root>,
    );
    const group = screen.getByTestId("group");
    expect(group.hasAttribute("data-disabled")).toBe(false);
  });

  it("owns the spinbutton ARIA/value/disabled/readonly contract on Input regardless of consumer override attempts", () => {
    // NumberField.Input's public prop type has no native-attribute pass-through
    // for role/value/onChange, but the implementation still spreads unrecognized
    // keys into consumerProps at runtime — `as any` exercises that path the same
    // way an untyped/JS consumer would.
    const overrides = {
      role: "textbox",
      value: "wrong",
      onChange: () => {},
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input
          aria-label="Amount"
          aria-valuenow={999}
          aria-valuemin={999}
          aria-valuemax={999}
          data-disabled="nope"
          data-readonly="nope"
          {...overrides}
        />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("aria-valuenow")).toBe("5");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
    expect(input.hasAttribute("data-disabled")).toBe(false);
    expect(input.hasAttribute("data-readonly")).toBe(false);
    expect(input.value).toBe("5");
  });

  it("lets a consumer onChange veto the internal display-value sync (policy #1: form-control change veto)", () => {
    const consumerCalls: string[] = [];
    const overrides = {
      onChange: (event: { preventDefault: () => void }) => {
        consumerCalls.push("consumer");
        event.preventDefault();
      },
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" {...overrides} />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "42" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(input.value).toBe("5");
  });

  it("lets a consumer onKeyDown veto arrow-key stepping (policy #1: form-control change veto)", () => {
    const overrides = {
      onKeyDown: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" {...overrides} />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("5");
  });

  it("lets a consumer onBlur veto the internal commit-on-blur clamp (policy #1: form-control change veto)", () => {
    const overrides = {
      onBlur: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" {...overrides} />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.blur(input);
    // uncommitted: without the veto, blur would clamp "99" down to max (10)
    expect(input.value).toBe("99");
  });

  it("owns type/tabIndex/data-disabled/disabled on Increment regardless of consumer override attempts", () => {
    const overrides = { type: "submit", tabIndex: 3, disabled: true } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Increment aria-label="Increase" data-disabled="nope" {...overrides} />
      </NumberField.Root>,
    );
    const button = screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement;
    expect(button.type).toBe("button");
    expect(button.tabIndex).toBe(-1);
    expect(button.hasAttribute("data-disabled")).toBe(false);
    expect(button.disabled).toBe(false);
  });

  it("lets a consumer onClick veto the internal increment", () => {
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" />
        <NumberField.Increment aria-label="Increase" {...overrides} />
      </NumberField.Root>,
    );
    const button = screen.getByRole("button", { name: "Increase" });
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.click(button);
    expect(input.value).toBe("5");
  });

  it("lets a consumer onPointerDown veto the press-and-hold repeat start", () => {
    const overrides = {
      onPointerDown: (event: { preventDefault: () => void }) => event.preventDefault(),
    } as any;
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" />
        <NumberField.Increment aria-label="Increase" {...overrides} />
      </NumberField.Root>,
    );
    const button = screen.getByRole("button", { name: "Increase" });
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.pointerDown(button, { button: 0 });
    expect(input.value).toBe("5");
  });
});
