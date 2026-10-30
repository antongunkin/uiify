import { fireEvent, render } from "@testing-library/react";
import { createRef, type MouseEvent, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { assertSSRRenderable } from "../test-utils/ssr.js";
import { CandleChart } from "./CandleChart.js";
import type { CandleChartData } from "./types.js";

const DATA: readonly CandleChartData[] = [
  { time: "2026-09-01", open: 100, high: 112, low: 96, close: 108 },
  { time: "2026-09-02", open: 108, high: 110, low: 98, close: 101 },
];

describe("CandleChart", () => {
  it("allows candle hit labels to be localized with a time template", () => {
    const { container } = render(
      <CandleChart
        data={[{ time: "2026-01-01", open: 1, high: 2, low: 0, close: 1 }]}
        interactive
        labels={{ candle: "شمعة {time}" }}
      />,
    );

    expect(container.querySelector('[data-part="candle-hit"]')?.getAttribute("aria-label")).toBe(
      "شمعة 2026-01-01",
    );
  });

  it("uses localized labels for the chart, axes and data table", () => {
    const { container } = render(
      <CandleChart
        data={[{ time: "2026-01-01", open: 1, high: 2, low: 0, close: 1 }]}
        labels={{
          chart: "مخطط الشموع",
          candles: "شموع",
          months: "أشهر",
          prices: "أسعار",
          data: "بيانات",
          time: "الوقت",
          open: "الافتتاح",
          high: "الأعلى",
          low: "الأدنى",
          close: "الإغلاق",
        }}
      />,
    );
    expect(container.querySelector("figure")?.getAttribute("aria-label")).toBe("مخطط الشموع");
    expect(container.querySelector('[data-part="candles"]')?.getAttribute("aria-label")).toBe(
      "مخطط الشموع شموع",
    );
    expect(container.querySelector('[data-axis="time"]')?.getAttribute("aria-label")).toBe(
      "مخطط الشموع أشهر",
    );
    expect(container.querySelector('[data-axis="price"]')?.getAttribute("aria-label")).toBe(
      "مخطط الشموع أسعار",
    );
    expect(container.querySelector("table")?.getAttribute("aria-label")).toBe("مخطط الشموع بيانات");
    expect(container.querySelector("thead")?.textContent).toContain("الوقت");
    expect(container.querySelector("thead")?.textContent).toContain("الإغلاق");
  });

  it("uses aria-label as the base for composed accessible names", () => {
    const { container } = render(
      <CandleChart
        data={DATA}
        aria-label="Market overview"
        labels={{
          chart: "Localized chart",
          candles: "bars",
          months: "periods",
          prices: "values",
          data: "records",
        }}
      />,
    );

    expect(container.querySelector("figure")?.getAttribute("aria-label")).toBe("Market overview");
    expect(container.querySelector('[data-part="candles"]')?.getAttribute("aria-label")).toBe(
      "Market overview bars",
    );
    expect(container.querySelector('[data-axis="time"]')?.getAttribute("aria-label")).toBe(
      "Market overview periods",
    );
    expect(container.querySelector('[data-axis="price"]')?.getAttribute("aria-label")).toBe(
      "Market overview values",
    );
    expect(container.querySelector("table")?.getAttribute("aria-label")).toBe(
      "Market overview records",
    );
  });

  it("preserves the default composed accessible names", () => {
    const { container } = render(<CandleChart data={DATA} />);

    expect(container.querySelector('[data-part="candles"]')?.getAttribute("aria-label")).toBe(
      "Candlestick chart candles",
    );
    expect(container.querySelector('[data-axis="time"]')?.getAttribute("aria-label")).toBe(
      "Candlestick chart months",
    );
    expect(container.querySelector('[data-axis="price"]')?.getAttribute("aria-label")).toBe(
      "Candlestick chart prices",
    );
    expect(container.querySelector("table")?.getAttribute("aria-label")).toBe(
      "Candlestick chart data",
    );
  });

  it("renders each OHLC item as a decorative candle with responsive geometry", () => {
    const { container } = render(<CandleChart data={DATA} data-testid="chart" />);
    const chart = container.querySelector("[data-testid='chart']") as HTMLElement;
    const candles = [...chart.querySelectorAll('[data-part="candles"] > li')];

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

  it("forwards slot props to generated candles, axes, hit targets, and table rows", () => {
    const onCandleHitClick = vi.fn();
    const candleRef = createRef<HTMLElement>();
    const { container } = render(
      <CandleChart
        data={DATA}
        interactive
        slotProps={{
          caption: { className: "caption", "data-testid": "caption" },
          candle: {
            className: "all-candles",
            ref: candleRef,
            byItemIndex: { 1: { className: "second-candle", "data-testid": "candle-1" } },
          },
          candleHit: {
            onClick: onCandleHitClick,
            byItemIndex: { 1: { "data-testid": "candle-hit-1" } },
          },
          timeAxisLabel: {
            className: "month-label",
            byItemIndex: { 0: { "data-testid": "month-0" } },
          },
          dataTableRow: {
            byItemIndex: { 1: { className: "second-row", "data-testid": "row-1" } },
          },
          dataTableCloseCell: { className: "close-cell" },
        }}
      />,
    );

    expect(container.querySelector('[data-testid="caption"]')?.className).toContain("caption");
    expect(container.querySelectorAll('[data-part="candle"]')[0]?.className).toContain(
      "all-candles",
    );
    expect(container.querySelector('[data-testid="candle-1"]')?.className).toContain(
      "second-candle",
    );
    expect(container.querySelector('[data-testid="month-0"]')?.className).toContain("month-label");
    expect(container.querySelector('[data-testid="row-1"]')?.className).toContain("second-row");
    expect(container.querySelector("tbody tr td:last-child")?.className).toContain("close-cell");
    expect(candleRef.current?.tagName).toBe("LI");

    fireEvent.click(container.querySelector('[data-testid="candle-hit-1"]') as HTMLButtonElement);
    expect(onCandleHitClick).toHaveBeenCalledOnce();
  });

  it("lets a candle-hit native click handler cancel chart activation", () => {
    const onCandleClick = vi.fn();
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    const { container } = render(
      <CandleChart
        data={DATA}
        interactive
        onCandleClick={onCandleClick}
        slotProps={{ candleHit: { onClick } }}
      />,
    );

    fireEvent.click(container.querySelector('[data-part="candle-hit"]') as HTMLButtonElement);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onCandleClick).not.toHaveBeenCalled();
  });

  it("lets consumers replace candle state and anatomy defaults", () => {
    const { container } = render(
      <CandleChart
        data={DATA}
        slotProps={{
          candle: { byItemIndex: { 0: { "data-direction": "custom" } } },
          priceAxis: { "data-part": "custom-axis" },
        }}
      />,
    );
    expect(container.querySelector('[data-part="candle"]')?.getAttribute("data-direction")).toBe(
      "custom",
    );
    expect(container.querySelector('[data-part="custom-axis"]')).not.toBeNull();
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
    const candles = container.querySelectorAll('[data-part="candles"] > li');
    const active = candles[1];

    expect(container.querySelector('[data-part="plot"]')?.getAttribute("aria-hidden")).toBeNull();
    expect(active?.querySelector('[data-part="candle-hit"]')?.tagName).toBe("BUTTON");
    expect(active?.getAttribute("data-crosshair-active")).toBe("");
    expect(active?.getAttribute("data-tooltip-open")).toBeNull();
    expect(active?.getAttribute("style")).not.toContain("--candle-open");
    expect(active?.querySelector('[data-part="crosshair"]')).toBeNull();
    expect(container.querySelector('[data-part="readout"]')?.textContent).toContain("O 108");
    expect(container.querySelector('[data-part="readout"]')?.textContent).toContain("H 110");
    expect(container.querySelector('[data-part="readout"]')?.textContent).toContain("L 98");
    expect(container.querySelector('[data-part="readout"]')?.textContent).toContain("C 101");
    expect(
      container.querySelector('[data-part="viewport"] > [data-part="crosshair"]'),
    ).not.toBeNull();
  });

  it("keeps a doji distinct when open equals close", () => {
    const { container } = render(
      <CandleChart data={[{ time: 1, open: 10, high: 12, low: 8, close: 10 }]} />,
    );

    expect(
      container.querySelector('[data-part="candles"] > li')?.getAttribute("data-direction"),
    ).toBe("flat");
  });

  it("keeps a flat price range renderable", () => {
    const { container } = render(
      <CandleChart data={[{ time: 1, open: 10, high: 10, low: 10, close: 10 }]} />,
    );

    expect(container.querySelector('[data-part="candles"] > li')?.getAttribute("style")).toContain(
      "--candle-body-top: 50%",
    );
  });

  it("renders month and price legends from the OHLC range", () => {
    const data = [
      ...DATA,
      { time: "2026-10-01", open: 101, high: 120, low: 100, close: 116 },
    ] satisfies readonly CandleChartData[];
    const { container } = render(<CandleChart data={data} />);

    const timeViewport = container.querySelector('[data-part="time-viewport"]');
    const scrollViewport = container.querySelector('[data-part="scroll-viewport"]');
    const canvas = container.querySelector('[data-part="canvas"]');
    const months = container.querySelectorAll("[data-axis='time'] > li");
    const prices = container.querySelectorAll("[data-axis='price'] > li");

    expect(timeViewport).not.toBeNull();
    expect(scrollViewport).not.toBeNull();
    expect(scrollViewport?.querySelector('[data-part="canvas"]')).toBe(canvas);
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

  it("formats axis labels with the locale prop and defaults to en-US", () => {
    const axisText = (chart: ReactElement, axis: string) => {
      const { container, unmount } = render(chart);
      const text = container.querySelector(`[data-axis='${axis}']`)?.textContent ?? "";
      unmount();
      return text;
    };

    const arabic = <CandleChart data={DATA} locale="ar-EG" />;
    const english = <CandleChart data={DATA} locale="en-US" />;
    const implicit = <CandleChart data={DATA} />;
    expect(axisText(arabic, "price")).toMatch(/[٠-٩]/);
    expect(axisText(arabic, "time")).not.toBe(axisText(english, "time"));
    expect(axisText(implicit, "time")).toBe(axisText(english, "time"));
    expect(axisText(implicit, "time")).toContain("Sep");
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
