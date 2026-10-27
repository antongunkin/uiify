import { expect, it } from "vitest";
import type { CheckboxSlotProps } from "./types.js";

it("rejects generated content on native checkbox slots", () => {
  const invalidChildren: CheckboxSlotProps = {
    input: {
      // @ts-expect-error The checkbox input has no consumer-owned children.
      children: "replacement",
    },
  };
  const invalidMarkup: CheckboxSlotProps = {
    input: {
      // @ts-expect-error Native input slots cannot inject HTML.
      dangerouslySetInnerHTML: { __html: "<span>replacement</span>" },
    },
  };

  expect([invalidChildren, invalidMarkup]).toHaveLength(2);
});
