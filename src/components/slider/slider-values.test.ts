import { describe, expect, it } from "vitest";

import { getSliderStops, snapSliderToStops } from "./slider-values.js";

describe("slider value stops", () => {
  it("filters invalid marks and returns sorted unique stops with endpoints", () => {
    expect(
      getSliderStops(0, 10, [
        { value: 5 },
        { value: 2 },
        { value: 5 },
        { value: 11 },
        { value: Number.NaN },
      ]),
    ).toEqual([0, 2, 5, 10]);
  });

  it("uses min and max when there are no marks", () => {
    expect(getSliderStops(-10, 10, [])).toEqual([-10, 10]);
  });

  it("clamps values and snaps equal-distance ties to the lower stop", () => {
    expect(snapSliderToStops(-2, [0, 4, 10])).toBe(0);
    expect(snapSliderToStops(7, [0, 4, 10])).toBe(4);
    expect(snapSliderToStops(20, [0, 4, 10])).toBe(10);
  });
});
