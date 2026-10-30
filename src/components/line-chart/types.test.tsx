import { expect, it } from "vitest";
import type { LineChartProps, LineChartSlotProps } from "./types.js";

it("accepts native slot props and item-index overrides", () => {
  const slots: LineChartSlotProps = {
    caption: { className: "caption", id: "caption", "data-testid": "caption" },
    point: {
      className: "point",
      byItemIndex: { 2: { className: "selected", "data-testid": "point-2" } },
    },
    pointHit: {
      byItemIndex: { 2: { "data-testid": "point-hit-2" } },
    },
    dataTableRow: { byItemIndex: { 2: { className: "row-2" } } },
    liveScrollport: { className: "scrollport", ref: (element) => void element },
  };
  const chart: LineChartProps = { data: [], slotProps: slots };
  expect(chart.slotProps).toBe(slots);
});

it("accepts native point state and marker overrides", () => {
  const chart: LineChartProps = {
    data: [],
    "aria-label": undefined,
    slotProps: {
      plot: { "data-part": "other" },
      point: { byItemIndex: { 0: { "data-crosshair-active": "", "aria-hidden": undefined } } },
      pointHit: { type: "submit", "aria-pressed": undefined },
    },
  };
  expect(chart.slotProps?.pointHit?.type).toBe("submit");
});
