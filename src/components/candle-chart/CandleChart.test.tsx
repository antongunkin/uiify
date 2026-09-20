import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { CandleChart } from "./CandleChart.js";
import type { CandleChartData } from "./types.js";

const DATA: readonly CandleChartData[] = [
  { time: "2026-09-01", open: 100, high: 112, low: 96, close: 108 },
  { time: "2026-09-02", open: 108, high: 110, low: 98, close: 101 },
];

describe("CandleChart", () => {
  it("renders each OHLC item as a decorative candle with responsive geometry", () => {
    const { container } = render(<CandleChart data={DATA} data-testid="chart" />);
    const chart = container.querySelector("[data-testid='chart']") as HTMLElement;
    const candles = [...chart.querySelectorAll(".candle-chart__candles > li")];

    expect(chart.tagName).toBe("FIGURE");
    expect(chart.getAttribute("data-uiify-candle-chart")).toBe("");
    expect(candles).toHaveLength(2);
    expect(chart.querySelectorAll("i")).toHaveLength(0);
    expect(chart.querySelectorAll("ol > li > *")).toHaveLength(0);
    expect(candles[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(candles[0]?.getAttribute("data-direction")).toBe("up");
    expect(candles[1]?.getAttribute("data-direction")).toBe("down");
    expect(candles[0]?.getAttribute("data-time")).toBe("2026-09-01");
    expect(candles[0]?.getAttribute("style")).toContain("--candle-x: 0%");
    expect(candles[0]?.getAttribute("style")).toContain("--candle-slot: 50%");
    expect(candles[0]?.getAttribute("style")).not.toContain("--candle-open");
    expect(candles[0]?.getAttribute("style")).toContain("--candle-body-top:");
    expect(candles[0]?.getAttribute("style")).toContain("--candle-wick-height:");
  });

  it("renders a table fallback with the original OHLC values", () => {
    const { container } = render(<CandleChart data={DATA} aria-label="Daily candles" />);
    const table = container.querySelector("table");

    expect(table?.getAttribute("aria-label")).toBe("Daily candles data");
    expect(table?.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(table?.textContent).toContain("2026-09-01");
    expect(table?.textContent).toContain("112");
    expect(table?.textContent).toContain("96");
  });

  it("renders the active candle readout with React values", () => {
    const onCandleClick = () => undefined;
    const { container } = render(
      <CandleChart
        data={DATA}
        interactive
        activeCandleIndex={1}
        selectedCandleIndex={1}
        cursorY={42}
        onCandleClick={onCandleClick}
      />,
    );
    const candles = container.querySelectorAll(".candle-chart__candles > li");
    const active = candles[1];

    expect(container.querySelector(".candle-chart__plot")?.getAttribute("aria-hidden")).toBeNull();
    expect(active?.querySelector(".candle-chart__candle-hit")?.tagName).toBe("BUTTON");
    expect(active?.getAttribute("data-crosshair-active")).toBe("");
    expect(active?.getAttribute("data-tooltip-open")).toBeNull();
    expect(active?.getAttribute("style")).not.toContain("--candle-open");
    expect(active?.querySelector(".candle-chart__crosshair")).toBeNull();
    expect(container.querySelector(".candle-chart__readout")?.textContent).toContain("O 108");
    expect(container.querySelector(".candle-chart__readout")?.textContent).toContain("H 110");
    expect(container.querySelector(".candle-chart__readout")?.textContent).toContain("L 98");
    expect(container.querySelector(".candle-chart__readout")?.textContent).toContain("C 101");
    expect(
      container.querySelector(".candle-chart__viewport > .candle-chart__crosshair"),
    ).not.toBeNull();
  });

  it("keeps a doji distinct when open equals close", () => {
    const { container } = render(
      <CandleChart data={[{ time: 1, open: 10, high: 12, low: 8, close: 10 }]} />,
    );

    expect(
      container.querySelector(".candle-chart__candles > li")?.getAttribute("data-direction"),
    ).toBe("flat");
  });

  it("keeps a flat price range renderable", () => {
    const { container } = render(
      <CandleChart data={[{ time: 1, open: 10, high: 10, low: 10, close: 10 }]} />,
    );

    expect(container.querySelector(".candle-chart__candles > li")?.getAttribute("style")).toContain(
      "--candle-body-top: 50%",
    );
  });

  it("renders month and price legends from the OHLC range", () => {
    const data = [
      ...DATA,
      { time: "2026-10-01", open: 101, high: 120, low: 100, close: 116 },
    ] satisfies readonly CandleChartData[];
    const { container } = render(<CandleChart data={data} />);

    const timeViewport = container.querySelector(".candle-chart__time-viewport");
    const scrollViewport = container.querySelector(".candle-chart__scroll-viewport");
    const canvas = container.querySelector(".candle-chart__canvas");
    const months = container.querySelectorAll("[data-axis='time'] > li");
    const prices = container.querySelectorAll("[data-axis='price'] > li");

    expect(timeViewport).not.toBeNull();
    expect(scrollViewport).not.toBeNull();
    expect(scrollViewport?.querySelector(".candle-chart__canvas")).toBe(canvas);
    expect(timeViewport?.querySelector("[data-axis='time']")).not.toBeNull();
    expect(months).toHaveLength(2);
    expect(months[0]?.textContent).toContain("Sep");
    expect(months[1]?.textContent).toContain("Oct");
    expect(months[1]?.getAttribute("style")).toContain("--candle-axis-x:");
    expect(prices).toHaveLength(6);
    expect(prices[0]?.textContent).toBe("120");
    expect(prices[5]?.textContent).toBe("96");
    expect(prices[3]?.getAttribute("style")).toContain("--candle-axis-y:");
  });

  it("accepts arbitrary axis labels and positions", () => {
    const { container } = render(
      <CandleChart
        data={DATA}
        xAxis={[{ label: "Launch", position: -12.5 }]}
        yAxis={[{ label: "$100.25", position: 137.5 }]}
      />,
    );

    const xAxis = container.querySelector("[data-axis='time']");
    const yAxis = container.querySelector("[data-axis='price']");

    expect(xAxis?.textContent).toBe("Launch");
    expect(xAxis?.querySelector("li")?.getAttribute("style")).toContain("--candle-axis-x: 0%");
    expect(yAxis?.textContent).toBe("$100.25");
    expect(yAxis?.querySelector("li")?.getAttribute("style")).toContain("--candle-axis-y: 100%");
  });

  it("formats numeric dates without a hardcoded month-name fixture", () => {
    const { container } = render(
      <CandleChart
        data={[{ time: Date.UTC(2026, 8, 1), open: 10, high: 12, low: 8, close: 11 }]}
      />,
    );

    expect(container.querySelector("[data-axis='time']")?.textContent).toContain("Sep");
    expect(container.querySelector("[data-axis='time']")?.textContent).toContain("26");
  });

  it("forwards consumer props and renders on the server", () => {
    const { container } = render(<CandleChart data={DATA} className="custom" />);
    expect(container.querySelector("figure")?.className).toContain("custom");

    const html = assertSSRRenderable(<CandleChart data={DATA} aria-label="Server candles" />);
    expect(html).toContain("data-uiify-candle-chart");
    expect(html).not.toContain("use client");
  });
});
