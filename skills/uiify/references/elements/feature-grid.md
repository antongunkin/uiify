# feature-grid

Binding: gap

Present related product capabilities as a coherent set.

## Use when

Several related capabilities have equal importance and repeat the same content shape.

## Avoid when

Do not force unequal priorities or long-form explanations into a uniform grid. Use a comparison table when people must compare values across features.

## Structure

Use a labeled `Section` with a `Grid` holding one item per feature; give each item a heading and short explanation. Use the same order and content hierarchy for every item.

## Responsive

Collapse to one column on narrow screens and retain source order. Avoid fixed heights that clip translated or zoomed text.

## States

Keep item actions consistent. If each feature links to detail, link its heading and retain a clear focus indicator.

## Verify

Check section label, heading levels, source order, one-column reflow, link names, and the card spacing at mobile width.

## Common mistake

Do not use three equal cards to imply equal priority when one feature is the primary action.

## Custom implementation

This is an app-level composition; UIify does not ship a feature grid component. Compose it from a labeled `Section`, a `Grid` and one `Stack` per item with a `Heading` and `Text`.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-10-16)
