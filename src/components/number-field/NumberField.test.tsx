import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { NumberField } from "./NumberField.js";

describe("NumberField", () => {
  it("renders a spinbutton input contract before hydration", () => {
    render(
      <NumberField.Root defaultValue={5} min={0} max={10} step={2}>
        <NumberField.Group data-testid="group">
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
    expect(screen.getByTestId("group").getAttribute("data-part")).toBe("group");
    expect(input.getAttribute("data-part")).toBe("input");
    expect(screen.getByRole("button", { name: "Decrease" }).getAttribute("data-part")).toBe(
      "decrement",
    );
    expect(screen.getByRole("button", { name: "Increase" }).getAttribute("data-part")).toBe(
      "increment",
    );
  });

  it("formats with an explicit locale and defaults to en-US", () => {
    const { unmount } = render(
      <NumberField.Root locale="de-DE" defaultValue={1234.5}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("1.234,5");
    unmount();
    render(
      <NumberField.Root defaultValue={1234.5}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("1,234.5");
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

  it("accepts root identity and state marker overrides", () => {
    const { container } = render(
      <NumberField.Root
        defaultValue={1}
        disabled
        data-disabled="nope"
        data-uiify-number-field="nope"
      >
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-disabled")).toBe("nope");
    expect(root.getAttribute("data-uiify-number-field")).toBe("nope");
  });

  it("accepts group state marker overrides", () => {
    render(
      <NumberField.Root defaultValue={1}>
        <NumberField.Group data-disabled="nope" data-testid="group">
          <NumberField.Input aria-label="Amount" />
        </NumberField.Group>
      </NumberField.Root>,
    );
    const group = screen.getByTestId("group");
    expect(group.getAttribute("data-disabled")).toBe("nope");
  });

  it("accepts native input value and semantic overrides", () => {
    const overrides = {
      role: "textbox",
      value: "wrong",
      onChange: () => {},
    };
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
    const input = screen.getByRole("textbox", { name: "Amount" }) as HTMLInputElement;
    expect(input.getAttribute("role")).toBe("textbox");
    expect(input.getAttribute("aria-valuenow")).toBe("999");
    expect(input.getAttribute("aria-valuemin")).toBe("999");
    expect(input.getAttribute("aria-valuemax")).toBe("999");
    expect(input.getAttribute("data-disabled")).toBe("nope");
    expect(input.getAttribute("data-readonly")).toBe("nope");
    expect(input.value).toBe("wrong");
  });

  it("lets a consumer onChange veto the internal display-value sync (policy #1: form-control change veto)", () => {
    const consumerCalls: string[] = [];
    const overrides = {
      onChange: (event: { preventDefault: () => void }) => {
        consumerCalls.push("consumer");
        event.preventDefault();
      },
    };
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
    };
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" {...overrides} />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("5");
  });

  it("does not step during input method composition", () => {
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Input aria-label="Amount" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" }) as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp", isComposing: true });
    fireEvent.keyDown(input, { key: "ArrowUp", keyCode: 229 });
    expect(input.value).toBe("5");
  });

  it("lets a consumer onBlur veto the internal commit-on-blur clamp (policy #1: form-control change veto)", () => {
    const overrides = {
      onBlur: (event: { preventDefault: () => void }) => event.preventDefault(),
    };
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

  it("accepts native increment-button overrides", () => {
    const overrides = { type: "submit" as const, tabIndex: 3, disabled: true };
    render(
      <NumberField.Root defaultValue={5} min={0} max={10}>
        <NumberField.Increment aria-label="Increase" data-disabled="nope" {...overrides} />
      </NumberField.Root>,
    );
    const button = screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement;
    expect(button.type).toBe("submit");
    expect(button.tabIndex).toBe(3);
    expect(button.getAttribute("data-disabled")).toBe("nope");
    expect(button.disabled).toBe(true);
  });

  it("lets a consumer onClick veto the internal increment", () => {
    const overrides = {
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    };
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
    };
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
