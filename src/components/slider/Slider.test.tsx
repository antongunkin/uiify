import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Slider } from "./Slider.js";

describe("Slider", () => {
  it("passes no onChange to the input when no handler is given (Server Components)", () => {
    // The root div wraps the input element.
    const props = (element: unknown) =>
      (element as { props: { children: { props: { onChange?: unknown } } } }).props.children.props;
    expect(props(Slider({ "aria-label": "Volume" })).onChange).toBeUndefined();
    expect(typeof props(Slider({ onValueChange: () => {} })).onChange).toBe("function");
    expect(typeof props(Slider({ onChange: () => {} })).onChange).toBe("function");
  });

  it("writes no inline style: CSS paints the fill from the native value", () => {
    render(<Slider defaultValue={30} onValueChange={() => {}} aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.hasAttribute("style")).toBe(false);
    fireEvent.change(slider, { target: { value: "42" } });
    expect(slider.hasAttribute("style")).toBe(false);
  });

  it("fires onValueChange from native range changes without owner rerenders", () => {
    const onValueChange = vi.fn();
    const { Wrapper, getCommitCount } = createRenderCounter();

    render(
      <Wrapper>
        <Slider defaultValue={0} onValueChange={onValueChange} aria-label="Volume" />
      </Wrapper>,
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.change(slider, { target: { value: "42" } });
    expect(onValueChange).toHaveBeenCalledWith(42);
    expect(getCommitCount()).toBe(1);
  });

  it("maps min, max, step, and disabled", () => {
    render(<Slider min={10} max={20} step={2} disabled aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" }) as HTMLInputElement;
    expect(slider.min).toBe("10");
    expect(slider.max).toBe("20");
    expect(slider.step).toBe("2");
    expect(slider.disabled).toBe(true);
  });

  it("reflects controlled data-state", () => {
    render(<Slider value={55} aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.getAttribute("data-state")).toBe("55");
    expect(slider.classList.contains("uiify-slider-input")).toBe(true);
    expect(slider.hasAttribute("data-uiify-slider")).toBe(false);
  });

  it("renders its identity class without a legacy marker", () => {
    render(<Slider defaultValue={25} aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.classList.contains("uiify-slider-input")).toBe(true);
    expect(slider.parentElement?.classList.contains("uiify-slider")).toBe(true);
    expect(slider.hasAttribute("data-uiify-slider")).toBe(false);
  });

  it("lets consumers override data-disabled and data-state", () => {
    render(<Slider value={55} disabled data-disabled="no" data-state="0" aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.getAttribute("data-disabled")).toBe("no");
    expect(slider.getAttribute("data-state")).toBe("0");
  });

  it("lets a consumer onChange veto the internal value sync (policy #1: form-control change veto)", () => {
    const onValueChange = vi.fn();
    const consumerCalls: string[] = [];
    render(
      <Slider
        defaultValue={0}
        onValueChange={onValueChange}
        onChange={(event) => {
          consumerCalls.push("consumer");
          event.preventDefault();
        }}
        aria-label="Volume"
      />,
    );
    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.change(slider, { target: { value: "42" } });
    expect(consumerCalls).toEqual(["consumer"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders consistent SSR markup", () => {
    const markup = renderToStaticMarkup(<Slider defaultValue={5} aria-label="Volume" />);
    expect(markup).toContain('type="range"');
    expect(markup).toContain('value="5"');
  });
});
