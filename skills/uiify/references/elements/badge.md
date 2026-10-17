# badge

Binding: gap

Mark a short status or category beside related content.

## Use when

A short status or category qualifies nearby content and helps people scan it.

## Avoid when

Do not use a badge for a control, long explanation, or decoration that repeats an adjacent heading without adding meaning.

## Structure

This is an app-level composition, not a UIify component. Use non-interactive text beside the item it qualifies. Include the status in words; color and shape are supplementary.

## Responsive

Allow text to wrap or choose a concise label that remains readable at zoom. Keep the badge attached to its related heading or value in reading order.

## States

For status changes, update the text and announce meaningful dynamic changes in an appropriate status region. Do not use badge styling alone to indicate selection.

## Verify

Check text contrast, status conveyed without color, association with the item, zoom, and dynamic announcement only when needed.

## Common mistake

A green dot without a textual status does not explain what “active” means.

## Custom implementation

```html
<p>Deployment <span>Pending review</span></p>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-16)
