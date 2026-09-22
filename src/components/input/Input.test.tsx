import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Input } from "./Input.js";

describe("Input", () => {
  it("updates the DOM in uncontrolled mode without rerendering the owner", () => {
    const onValueChange = vi.fn();
    const { Wrapper, getCommitCount } = createRenderCounter();

    render(
      <Wrapper>
        <Input defaultValue="" onValueChange={onValueChange} aria-label="Name" />
      </Wrapper>,
    );

    expect(getCommitCount()).toBe(1);
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Ada" } });
    expect(input.value).toBe("Ada");
    expect(onValueChange).toHaveBeenCalledWith("Ada");
    expect(getCommitCount()).toBe(1);
  });

  it("reflects controlled value and rerenders the owner on change", () => {
    const onValueChange = vi.fn();
    const { Wrapper, getCommitCount } = createRenderCounter();
    const { rerender } = render(
      <Wrapper>
        <Input value="a" onValueChange={onValueChange} aria-label="Name" />
      </Wrapper>,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "b" },
    });
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(getCommitCount()).toBe(1);

    rerender(
      <Wrapper>
        <Input value="b" onValueChange={onValueChange} aria-label="Name" />
      </Wrapper>,
    );
    expect(getCommitCount()).toBe(2);
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onValueChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <Input
        defaultValue=""
        onValueChange={onValueChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
        aria-label="Name"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Ada" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("maps disabled, readOnly, and invalid to attributes and data hooks", () => {
    render(<Input disabled readOnly invalid aria-label="Field" />);
    const input = screen.getByRole("textbox", { name: "Field" }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.hasAttribute("data-disabled")).toBe(true);
    expect(input.hasAttribute("data-readonly")).toBe(true);
    expect(input.hasAttribute("data-invalid")).toBe(true);
  });

  it("owns aria-invalid, data-disabled, data-readonly and data-invalid; consumer cannot override them", () => {
    render(
      <Input
        disabled
        readOnly
        invalid
        aria-invalid={false}
        data-disabled="no"
        data-readonly="no"
        data-invalid="no"
        aria-label="Field"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Field" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("data-disabled")).toBe("");
    expect(input.getAttribute("data-readonly")).toBe("");
    expect(input.getAttribute("data-invalid")).toBe("");
  });

  it("forwards consumer styling props and owns its identity marker", () => {
    render(
      <Input
        aria-label="Field"
        className="consumer-input"
        data-layout="compact"
        data-uiify-input="consumer-value"
        style={{ marginBlock: "1rem" }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Field" });
    expect(input.getAttribute("class")).toBe("consumer-input");
    expect(input.getAttribute("data-layout")).toBe("compact");
    expect(input.getAttribute("data-uiify-input")).toBe("");
    expect(input.style.marginBlock).toBe("1rem");
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Input defaultValue="hello" disabled aria-label="Field" />);
    expect(markup).toContain('value="hello"');
    expect(markup).toContain("disabled");
  });
});
