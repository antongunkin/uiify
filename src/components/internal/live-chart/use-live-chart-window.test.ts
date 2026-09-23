import { describe, expect, it } from "vitest";
import { liveTimeAxis } from "./use-live-chart-window.js";

const DATA = Array.from({ length: 100 }, (_, index) => ({ time: `t${index}` }));

describe("liveTimeAxis", () => {
  it("pins ticks to absolute indices at slot centers across the whole content", () => {
    const labels = liveTimeAxis(DATA, 40, 60, 20);

    // step = 20 / 4 ticks = 5; one step of margin on each side of the slice.
    expect(labels.map((label) => label.label)).toEqual(["t35", "t40", "t45", "t50", "t55", "t60"]);
    expect(labels[1]?.position).toBeCloseTo((40.5 / 100) * 100);
  });

  it("keeps a tick on the same item as the slice advances", () => {
    const before = liveTimeAxis(DATA, 40, 60, 20).map((label) => label.label);
    const after = liveTimeAxis(DATA, 41, 61, 20).map((label) => label.label);

    expect(after).toEqual(expect.arrayContaining(["t45", "t50", "t55", "t60"]));
    expect(before).toEqual(expect.arrayContaining(["t45", "t50", "t55", "t60"]));
  });
});
