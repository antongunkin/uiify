# description-list

Binding: description-list

Present descriptive terms and their associated values.

## Use when

Show descriptive metadata as terms with associated values, such as status and owner.

## Avoid when

Use a table for tabular data and a list for tasks or actions. Do not use `dl` as a generic visual grid without term/value relationships.

## Structure

`DescriptionList` renders `dl`; compose `DescriptionTerm` (`dt`) and `DescriptionDetails` (`dd`) in consumer-authored source order. Keep each term adjacent to its description. Multiple terms or descriptions may be grouped when the content calls for it; no table roles or action-column API is added.

## Responsive

Let terms and long values wrap. A visual grid may stack at narrow widths, but DOM order remains term then details and uses logical CSS.

## States

This is static descriptive content with no selection or interaction state.

## Verify

Check source order, term/value pairing, long and CJK values, RTL, and zoom reflow. Assistive-technology announcements vary; no browser or screen-reader verification is recorded.

## Common mistake

Do not replace the native `dl`/`dt`/`dd` structure with table roles or make values depend on visual column alignment.

## Sources

- [design-system.service.gov.uk](https://design-system.service.gov.uk/components/summary-list/) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl) (verified 2026-10-19)
