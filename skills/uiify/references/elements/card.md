# card

Binding: card

Group one feature heading and its explanation.

## Use when

A related heading, explanation, and optional links or actions need a clear content group.

## Avoid when

Do not wrap every paragraph or list item in a card. Avoid whole-surface click behavior when the card contains independent controls.

## Structure

`Card > CardHeader(CardTitle, CardDescription, CardAction?) + CardContent + CardFooter`. Every part is a `div`; give the title a heading with `CardTitle as="h2"` (or `h3`, following page order) and the root `as="article"` or `section` when the content warrants it. `CardAction` (a badge or small button) sits beside the title at the header's inline end; without it the title spans the header. `CardFooter` is a wrapping row of buttons or links. `size="sm"` tightens padding, gaps and title. `variant="highlight"` adds a primary border and a raised shadow to the one card to notice, such as a recommended plan. Padding lives on the root, so plain children in a `Card` also work. For a form use `<Card as="form" action method>`; a `form` wrapped around content and footer breaks the card's gap.

## Responsive

Let content set the height. Footer buttons wrap at narrow widths; allow the layout around cards to stack in source order at narrow widths and zoom.

## States

Card has no selection or interaction state. Add interactive semantics to a link, button, or other child only.

## Verify

Check heading order, focus visibility on child controls, the action at the title's inline end (mirrored in RTL), and one-column reflow in the consumer layout.

## Common mistake

Making the whole card a link while also nesting other links or buttons creates ambiguous interactive content. A 32 px `Button` as `CardAction` aligns to the title's top edge, so its label sits lower than the title; prefer a badge or `size="sm"` button.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-10-19)
