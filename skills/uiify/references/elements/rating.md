# rating

Binding: rating

Collect a numeric rating on a short ordered scale.

## Use when

Collect one value on a short ordered rating scale, such as a one-to-five star rating.

## Avoid when

Do not use stars for a binary choice or as the only way to report a detailed evaluation.

## Structure

Use the documented Rating with a stable id, a group name in aria-label, and an appropriate max. Each radio option exposes its star count as text; pair the scale with visible instructions that explain what low and high values mean.

## Responsive

Keep every rating option visible and large enough to select at narrow widths.

## States

Distinguish an unanswered rating from a selected value. Use readOnly for display-only ratings; use the client entry only when controlled updates are required.

## Verify

Test arrow-key selection, group and option names, value submission, read-only and disabled states, and whether users can tell what each end of the scale means.

## Common mistake

Showing decorative stars without a text name for the group or the value of each option.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
