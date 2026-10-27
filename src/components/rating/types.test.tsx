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
    // @ts-expect-error Radio checked state belongs to Rating's value props.
    const invalidInput: RatingProps = { id: "rating", slotProps: { input: { checked: true } } };
    // @ts-expect-error Rating owns its identity marker.
    const invalidMarker: RatingProps = { id: "rating", "data-uiify-rating": "no" };

    expect([valid, invalidRoot, invalidInput, invalidMarker].length).toBe(4);
  });
});
