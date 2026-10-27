import { expect, it } from "vitest";
import type { CandleChartProps, CandleChartSlotProps } from "./types.js";

it("accepts native candle slots and absolute index overrides", () => {
  const slots: CandleChartSlotProps = {
    candle: {
      className: "candle",
      byItemIndex: { 2: { className: "selected", "data-testid": "candle-2" } },
    },
    candleHit: { byItemIndex: { 2: { "data-testid": "hit-2" } } },
    dataTableCloseCell: { className: "close", byItemIndex: { 2: { "data-testid": "close-2" } } },
    liveScrollport: { className: "scrollport", ref: (element) => void element },
  };
  const chart: CandleChartProps = { data: [], slotProps: slots };
  expect(chart.slotProps).toBe(slots);
});

it("protects chart-owned markers, state, and generated content", () => {
  const invalidMarker: CandleChartProps = {
    data: [],
    // @ts-expect-error The price-axis anatomy marker is owned by CandleChart.
    slotProps: { priceAxis: { "data-part": "other" } },
  };
  const invalidCandleState: CandleChartProps = {
    data: [],
    // @ts-expect-error Candle direction comes from OHLC data.
    slotProps: { candle: { byItemIndex: { 0: { "data-direction": "up" } } } },
  };
  const invalidHtml: CandleChartProps = {
    data: [],
    slotProps: {
      candle: {
        byItemIndex: {
          // @ts-expect-error Generated slot children cannot be replaced with raw HTML.
          0: { dangerouslySetInnerHTML: { __html: "unsafe" } },
        },
      },
    },
  };

  expect([invalidMarker, invalidCandleState, invalidHtml]).toHaveLength(3);
});
