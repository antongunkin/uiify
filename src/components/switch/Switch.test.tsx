import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Switch } from "./Switch.js";

describe("Switch", () => {
  it("toggles via native click without owner rerenders", () => {
    const onCheckedChange = vi.fn();
    const { Wrapper, getCommitCount } = createRenderCounter();

    render(
      <Wrapper>
        <Switch defaultChecked={false} onCheckedChange={onCheckedChange} aria-label="Wi-Fi" />
      </Wrapper>,
    );

    const control = screen.getByRole("switch", { name: "Wi-Fi" }) as HTMLInputElement;
    fireEvent.click(control);
    expect(control.checked).toBe(true);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getCommitCount()).toBe(1);
  });

  it("passes no onChange to the input when no handler is given (Server Components)", () => {
    const props = (element: unknown) => (element as { props: { onChange?: unknown } }).props;
    expect(props(Switch({ "aria-label": "Wi-Fi" })).onChange).toBeUndefined();
    expect(typeof props(Switch({ onCheckedChange: () => {} })).onChange).toBe("function");
    expect(typeof props(Switch({ onChange: () => {} })).onChange).toBe("function");
  });

  it("reflects controlled checked state and data-state", () => {
    render(<Switch checked aria-label="Wi-Fi" />);
    const control = screen.getByRole("switch", { name: "Wi-Fi" });
    expect((control as HTMLInputElement).checked).toBe(true);
    expect(control.getAttribute("data-state")).toBe("checked");
  });

  it("blocks interaction when disabled", () => {
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} aria-label="Wi-Fi" />);
    fireEvent.click(screen.getByRole("switch", { name: "Wi-Fi" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("lets a consumer override type, role, data-disabled and data-state (hard rule 4)", () => {
    render(
      <Switch
        checked
        disabled
        type="radio"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/role-has-required-aria-props -- The switch owns its role and checked state.
        role="checkbox"
        data-disabled="no"
        data-state="unchecked"
        aria-label="Wi-Fi"
      />,
    );
    const control = screen.getByRole("checkbox", { name: "Wi-Fi" });
    expect(control.getAttribute("type")).toBe("radio");
    expect(control.getAttribute("data-disabled")).toBe("no");
    expect(control.getAttribute("data-state")).toBe("unchecked");
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onCheckedChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <Switch
        defaultChecked={false}
        onCheckedChange={onCheckedChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
        aria-label="Wi-Fi"
      />,
    );
    fireEvent.click(screen.getByRole("switch", { name: "Wi-Fi" }));
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Switch defaultChecked aria-label="Wi-Fi" />);
    expect(markup).toContain('role="switch"');
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('class="uiify-switch"');
  });
});
