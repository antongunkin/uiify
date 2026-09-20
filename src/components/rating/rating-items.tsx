import { VisuallyHidden } from "@gunkin/uiify/core/visually-hidden";
import type { ChoiceItem } from "../internal/choice-family/types.js";

/**
 * One item per star, highest value first. rating.css relies on DOM order
 * being descending (max..1): `flex-direction: row-reverse` restores normal
 * left-to-right reading order, and the `:has(...) ~ [data-part="item"]`
 * highlight rule only reaches *later* DOM siblings, which — because of the
 * reversal — are the more-preferred stars. Ascending order would highlight
 * the wrong direction (and desync each star's visual position from its
 * value/label). The visible glyph is aria-hidden; the accessible name comes
 * from the visually-hidden "N star(s)" text alongside it, so
 * `aria-labelledby` (ChoiceGroup's mechanism) announces the count, not the
 * glyph itself.
 */
export function buildRatingItems(max: number, blocked: boolean): readonly ChoiceItem[] {
  return Array.from({ length: max }, (_, index) => {
    const value = max - index;
    return {
      value: String(value),
      label: (
        <>
          <VisuallyHidden>
            {value} {value === 1 ? "star" : "stars"}
          </VisuallyHidden>
          <span aria-hidden="true">★</span>
        </>
      ),
      disabled: blocked,
    };
  });
}
