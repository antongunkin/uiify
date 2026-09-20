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

  it("owns type, role, data-disabled and data-state; consumer cannot override them", () => {
    render(
      <Switch
        checked
        disabled
        type="radio"
        role="checkbox"
        data-disabled="no"
        data-state="unchecked"
        aria-label="Wi-Fi"
      />,
    );
    const control = screen.getByRole("switch", { name: "Wi-Fi" });
    expect(control.getAttribute("type")).toBe("checkbox");
    expect(control.getAttribute("data-disabled")).toBe("");
    expect(control.getAttribute("data-state")).toBe("checked");
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
  });
});
