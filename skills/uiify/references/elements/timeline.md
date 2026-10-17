# timeline

Binding: gap

Show dated events in chronological order.

## Use when

Events have a meaningful chronological sequence and each date needs to stay attached to its description.

## Avoid when

Do not use a timeline to decorate unrelated facts or imply chronology when events are unordered. Use a table when people need to compare attributes across events.

## Structure

This is an app-level composition, not a UIify component. Use an ordered list when sequence matters, and a time element with machine-readable datetime for each date. Keep event title and details in the same list item.

## Responsive

Preserve chronological reading order as a vertical list on narrow screens. Do not rely on left/right placement or connecting lines to communicate sequence.

## States

Distinguish past, current, and upcoming events in text when those states matter; color and position alone are insufficient.

## Verify

Check ordering, machine-readable dates, date format, current/upcoming meaning, list semantics, and narrow layout.

## Common mistake

A reverse chronological visual layout can conflict with DOM reading order if the markup is not ordered intentionally.

## Custom implementation

```html
<ol>
  <li><time datetime="2026-10-17">October 17, 2026</time><p>Release published</p></li>
</ol>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
