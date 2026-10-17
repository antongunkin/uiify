# bar-chart

Binding: gap

Compare values across a small set of named categories.

## Use when

Values are best compared across a modest set of named categories.

## Avoid when

Do not use a chart when a labeled table communicates the values more clearly, or when the category count makes bars and labels unreadable.

## Structure

This is an app-level composition, not a UIify component. Give the chart a concise title and text summary, label units and the compared period, and provide the same data in a readable table. Use SVG as a visual summary with a short accessible name.

## Responsive

Keep category names and values available when the graphic scales down. If the plot becomes cramped, allow a scrollable plot while leaving its data table readable.

## States

If values update, identify the period/version and expose the updated data in the table. Do not use color alone to distinguish series.

## Verify

Compare every plotted value with the table, check chart title/summary, units, axis labels, color contrast, and narrow viewport access.

## Common mistake

An SVG label such as “Sales chart” names the image but does not provide its values or trend.

## Custom implementation

```html
<figure>
  <figcaption>Signups by month, Q1 2026</figcaption>
  <svg role="img" aria-label="Signups rise from 12 in January to 19 in February and 24 in March">
    <!-- Render bars with category/value labels or a clear axis. -->
  </svg>
  <table>
    <caption>Signups by month (number of accounts)</caption>
    <thead><tr><th scope="col">Month</th><th scope="col">Signups</th></tr></thead>
    <tbody>
      <tr><th scope="row">January</th><td>12</td></tr>
      <tr><th scope="row">February</th><td>19</td></tr>
      <tr><th scope="row">March</th><td>24</td></tr>
    </tbody>
  </table>
</figure>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/tutorials/images/complex/) (verified 2026-10-16)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role) (verified 2026-10-16)
