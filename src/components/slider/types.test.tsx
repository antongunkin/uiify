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
  const invalidPart: SliderClientProps = {
    slotProps: {
      // @ts-expect-error data-part is owned by the library.
      track: { "data-part": "other" },
    },
  };
  const invalidValue: SliderClientProps = {
    slotProps: {
      input: {
        // @ts-expect-error Input value is controlled by SliderClient.
        value: 40,
      },
    },
  };

  expect([props, invalidPart, invalidValue]).toHaveLength(3);
});
