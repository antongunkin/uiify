# card

Binding: gap

Group one feature heading and its explanation.

## Use when

A small set of related content needs a clear grouping, with a heading and supporting detail.

## Avoid when

Do not wrap every paragraph or list item in a card. Avoid card-within-card nesting and whole-surface click behavior when the card contains multiple independent controls.

## Structure

This is an app-level composition, not a UIify component. Group one topic under a heading, add a concise description, and use a link for one clear destination. If the card has one destination, make the heading link the primary control; keep other controls separate.

## Responsive

Keep cards in reading order when the grid stacks. Let content determine height and align repeated actions without truncating essential labels.

## States

Use links for navigation and buttons for in-place actions. Add selected/pressed state only when the card itself represents a selectable item.

## Verify

Check heading hierarchy, reading order, single versus multiple actions, keyboard reachability, focus visibility, and one-column reflow.

## Common mistake

Making an entire card clickable while also placing buttons or links inside it creates nested, ambiguous controls.

## Custom implementation

```html
<article aria-labelledby="plan-title">
  <h2 id="plan-title"><a href="/plans/pro">Pro plan</a></h2>
  <p>For teams that need shared workspaces.</p>
</article>
```

This is an app-level composition; UIify does not currently ship this component.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-10-16)
