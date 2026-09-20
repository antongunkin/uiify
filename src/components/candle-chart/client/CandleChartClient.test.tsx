import { createEvent, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CandleChartClient } from "./CandleChartClient.js";

const DATA = Array.from({ length: 100 }, (_, index) => ({
  time: `2026-09-${String(index + 1).padStart(2, "0")}`,
  open: 100 + index,
  high: 110 + index,
  low: 90 + index,
  close: 105 + index,
}));

describe("CandleChartClient", () => {
  it("keeps the full data table while starting at the right edge", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.2");
    expect(chart.querySelectorAll(".candle-chart__candles > li")).toHaveLength(100);
    expect(chart.querySelectorAll("tbody tr")).toHaveLength(100);
  });

  it("intercepts vertical zoom while leaving horizontal movement native", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;

    fireEvent.wheel(chart, { deltaY: -100 });
    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.84");

    fireEvent.wheel(chart, { deltaX: -100 });
    expect(chart.style.getPropertyValue("--candle-scale")).toBe("3.84");
  });

  it("snaps the crosshair to the moved candle and updates the React readout on click", () => {
    const { container } = render(<CandleChartClient data={DATA} />);
    const chart = container.querySelector("[data-uiify-candle-chart]") as HTMLElement;
    const candles = chart.querySelectorAll<HTMLLIElement>(".candle-chart__candles > li");
    const target = candles[7] as HTMLLIElement;
    const hit = target.querySelector(".candle-chart__candle-hit") as HTMLButtonElement;

    const pointerMove = createEvent.pointerMove(hit);
    Object.defineProperty(pointerMove, "offsetY", { value: 24 });
    fireEvent(hit, pointerMove);
    expect(target?.getAttribute("data-crosshair-active")).toBe("");
    expect(
      chart.querySelector(".candle-chart__viewport > .candle-chart__crosshair"),
    ).not.toBeNull();
    expect(target?.getAttribute("style")).toContain("--candle-cursor-y: 24px");

    fireEvent.click(hit);
    expect(target?.getAttribute("data-tooltip-open")).toBeNull();
    expect(chart.querySelector(".candle-chart__readout")?.textContent).toContain("O 107");
    expect(chart.querySelector(".candle-chart__readout")?.textContent).toContain("C 112");
  });
});
