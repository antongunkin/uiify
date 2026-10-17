# feature-grid

Binding: gap

Present related product capabilities as a coherent set.

## Use when

Several related capabilities have equal importance and repeat the same content shape.

## Avoid when

Do not force unequal priorities or long-form explanations into a uniform grid. Use a comparison table when people must compare values across features.

## Structure

This is an app-level composition, not a UIify component. Render a labeled section containing a list of items; give each item a heading and short explanation. Use the same order and content hierarchy for every item.

## Responsive

Collapse to one column on narrow screens and retain source order. Avoid fixed heights that clip translated or zoomed text.

## States

Keep item actions consistent. If each feature links to detail, link its heading and retain a clear focus indicator.

## Verify

Check section label, heading levels, source order, one-column reflow, link names, and the card spacing at mobile width.

## Common mistake

Do not use three equal cards to imply equal priority when one feature is the primary action.

## Custom implementation

```html
<section aria-labelledby="features-title">
  <h2 id="features-title">Built for daily work</h2>
  <ul>
    <li><article><h3>Shared workspace</h3><p>Keep team work together.</p></article></li>
    <li><article><h3>Clear history</h3><p>See what changed and when.</p></article></li>
  </ul>
</section>
```

This is an app-level composition; UIify does not currently ship this component.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-10-16)
