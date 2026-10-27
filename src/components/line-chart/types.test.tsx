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

it("protects LineChart-owned point state and generated content", () => {
  const invalidMarker: LineChartProps = {
    data: [],
    // @ts-expect-error The plot anatomy marker is owned by LineChart.
    slotProps: { plot: { "data-part": "other" } },
  };
  const invalidPointState: LineChartProps = {
    data: [],
    // @ts-expect-error Point state attributes are computed from chart state.
    slotProps: { point: { byItemIndex: { 0: { "data-crosshair-active": "" } } } },
  };
  const invalidContent: LineChartProps = {
    data: [],
    // @ts-expect-error Generated points and readout content cannot be replaced.
    slotProps: { caption: { children: "replacement" } },
  };

  expect([invalidMarker, invalidPointState, invalidContent]).toHaveLength(3);
});
