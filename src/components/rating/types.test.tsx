import { describe, expect, it } from "vitest";
import type { RatingProps } from "./types.js";

describe("Rating props", () => {
  it("accept native root props and protect generated rating state", () => {
    const valid: RatingProps = {
      id: "rating",
      "data-testid": "rating",
      slotProps: {
        item: { byItemValue: { "3": { className: "third", "data-testid": "third-item" } } },
        input: { byItemValue: { "3": { "data-testid": "third-input" } } },
        label: { byItemValue: { "3": { "data-testid": "third-label" } } },
      },
    };

    // @ts-expect-error Rating owns its group id and never accepts raw HTML on the root.
    const invalidRoot: RatingProps = { id: "rating", dangerouslySetInnerHTML: { __html: "" } };
    // Consumer props replace library defaults, so slots and markers are open.
    const overriddenInput: RatingProps = { id: "rating", slotProps: { input: { checked: true } } };
    const overriddenMarker: RatingProps = { id: "rating", "data-uiify-rating": "no" };

    expect([valid, invalidRoot, overriddenInput, overriddenMarker].length).toBe(4);
  });
});
