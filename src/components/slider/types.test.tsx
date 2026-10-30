import { expect, it } from "vitest";
import type { SliderClientProps } from "./types.js";

it("types generated slider slots by their native elements and stable identities", () => {
  const props: SliderClientProps = {
    slotProps: {
      track: { className: "track", "data-testid": "track" },
      range: { className: "range" },
      mark: { byItemValue: { "50": { "data-testid": "mark-50" } } },
      visualThumb: { byItemValue: { minimum: { "data-testid": "visual-minimum" } } },
      input: { byItemValue: { maximum: { "aria-describedby": "maximum-help" } } },
    },
  };
  const overrides: SliderClientProps = {
    slotProps: {
      track: { "data-part": "other", "aria-hidden": undefined },
      input: { value: 40, type: "number", "aria-label": undefined },
    },
  };

  expect([props, overrides]).toHaveLength(2);
});
