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

it("accepts native candle state and marker overrides", () => {
  const chart: CandleChartProps = {
    data: [],
    "aria-label": undefined,
    slotProps: {
      priceAxis: { "data-part": "other" },
      candle: { byItemIndex: { 0: { "data-direction": "custom", "aria-hidden": undefined } } },
      candleHit: { type: "submit", "aria-pressed": undefined },
    },
  };
  expect(chart.slotProps?.candleHit?.type).toBe("submit");
});
