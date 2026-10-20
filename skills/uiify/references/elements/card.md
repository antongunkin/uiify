# card

Binding: card

Group one feature heading and its explanation.

## Use when

A related heading, explanation, and optional links or actions need a clear content group.

## Avoid when

Do not wrap every paragraph or list item in a card. Avoid whole-surface click behavior when the card contains independent controls.

## Structure

`Card` renders a `div` by default and accepts `as` for a semantic root such as `article`. Compose native headings, text, links, and buttons as children; each control remains independent.

## Responsive

Let content set the height. Keep links readable and allow the layout around cards to stack in source order at narrow widths and zoom.

## States

Card has no selection or interaction state. Add interactive semantics to a link, button, or other child only.

## Verify

Unit and public-page tests check the content root and independent link. Check heading order, focus visibility on child controls, and one-column reflow in the consumer layout.

## Common mistake

Making the whole card a link while also nesting other links or buttons creates ambiguous interactive content.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-10-19)
