import { createEvent, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LineChartClient } from "./LineChartClient.js";

const DATA = [
  { time: "2026-09-01", value: 100 },
  { time: "2026-09-02", value: 120 },
  { time: "2026-09-03", value: 110 },
];

const LONG_DATA = Array.from({ length: 100 }, (_, index) => ({
  time: `2026-09-${String(index + 1).padStart(2, "0")}`,
  value: 100 + index,
}));

describe("LineChartClient", () => {
  it("uses the CandleChart viewport for zoom and horizontal scrolling", () => {
    const { container } = render(<LineChartClient data={LONG_DATA} />);
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;

    expect(chart.style.getPropertyValue("--line-scale")).toBe("3.2");
    expect(chart.querySelector('[data-part="scroll-viewport"]')).not.toBeNull();
    expect(chart.querySelector('[data-part="canvas"]')).not.toBeNull();

    fireEvent.wheel(chart, { deltaY: -100 });
    expect(chart.style.getPropertyValue("--line-scale")).toBe("3.84");
  });

  it("updates the crosshair and React readout on pointer movement", () => {
    const onPointPointerMove = vi.fn();
    const { container } = render(
      <LineChartClient data={DATA} onPointPointerMove={onPointPointerMove} />,
    );
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;
    const target = chart.querySelectorAll<HTMLLIElement>('[data-part="points"] > li')[1];
    const hit = target?.querySelector("button") as HTMLButtonElement;
    const pointerMove = createEvent.pointerMove(hit);
    Object.defineProperty(pointerMove, "offsetY", { value: 24 });

    fireEvent(hit, pointerMove);

    expect(target?.getAttribute("data-crosshair-active")).toBe("");
    expect(target?.getAttribute("style")).toContain("--line-cursor-y: 24px");
    expect(chart.querySelector('[data-part="crosshair"]')).not.toBeNull();
    expect(onPointPointerMove).toHaveBeenCalledWith({ index: 1, offsetY: 24 });
  });

  it("selects a point with click and keyboard activation", () => {
    const onPointClick = vi.fn();
    const { container } = render(<LineChartClient data={DATA} onPointClick={onPointClick} />);
    const hit = container.querySelectorAll<HTMLButtonElement>(
      '[data-part="points"] button',
    )[2] as HTMLButtonElement;

    fireEvent.click(hit);
    expect(onPointClick).toHaveBeenCalledWith(2);
    expect(hit.getAttribute("aria-pressed")).toBe("true");

    fireEvent.keyDown(hit, { key: "Enter" });
    expect(onPointClick).toHaveBeenCalledTimes(2);
  });

  it("clears the active point when the pointer leaves", () => {
    const { container } = render(<LineChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-line-chart]") as HTMLElement;
    const hit = chart.querySelector('[data-part="points"] button') as HTMLButtonElement;

    fireEvent.pointerMove(hit);
    expect(chart.querySelector('[data-part="crosshair"]')).not.toBeNull();
    fireEvent.pointerLeave(hit);
    expect(chart.querySelector('[data-part="crosshair"]')).toBeNull();
  });
});
