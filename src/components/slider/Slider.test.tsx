import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createRenderCounter } from "../test-utils/RenderCounter.js";
import { renderToStaticMarkup } from "../test-utils/ssr.js";
import { Slider } from "./Slider.js";

describe("Slider", () => {
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
    expect(slider.getAttribute("data-uiify-slider")).toBe("");
  });

  it("owns data-disabled and data-state; consumer cannot override them", () => {
    render(<Slider value={55} disabled data-disabled="no" data-state="0" aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.getAttribute("data-disabled")).toBe("");
    expect(slider.getAttribute("data-state")).toBe("55");
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
