# search-input

Binding: gap

Find records in a collection or page.

## Use when

Help people find a record or content within a defined collection.

## Avoid when

Do not use a search field when the collection is small and browsing its links is clearer.

## Structure

Use a labelled search form and a native search input. Identify the collection being searched and keep filters, results, and pagination in a clear reading order.

## Responsive

Allow the field and result controls to wrap without clipping. Keep result content usable at narrow widths and zoom.

## States

Explain empty and no-match results separately. When results update without a page navigation, announce a concise result status.

## Verify

Check the visible label, submitted query behavior, empty/no-match states, keyboard access, and result announcement when updates are dynamic.

## Common mistake

Showing a magnifying-glass icon without an accessible name for the search field.

## Custom implementation

Use a search form with an associated label and an input of type search. This app-level recipe does not add a UIify search-input component.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-17)
