# stats-bar

Binding: gap

Summarize a few named values for one subject or time period.

## Use when

A few named values summarize one subject, population, and time period.

## Avoid when

Do not show unlabeled numbers, mix unlike periods/populations, or use a stats bar when people need detailed comparisons or exploration.

## Structure

This is an app-level composition, not a UIify component. Use a description list for term/value pairs and label units and the time period in text.

## Responsive

Let each label/value pair wrap and keep pairs together. Preserve source order as columns collapse.

## States

For values that update, explain their meaning and update timing; announce important changes without repeatedly interrupting users.

## Verify

Check labels, units, period, number formatting, reading order, and narrow layout. Ensure decoration does not carry the only meaning.

## Common mistake

“1,248” without a label, unit, or period is not an interpretable metric.

## Custom implementation

```html
<dl>
  <div><dt>Active users</dt><dd>1,248</dd></div>
  <div><dt>Period</dt><dd>Last 30 days</dd></div>
</dl>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
