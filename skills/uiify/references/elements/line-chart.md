# line-chart

Binding: line-chart

A measured value changes over an ordered time or numeric axis and the trend is useful

## Use when

A measured value changes over an ordered time or numeric axis and the trend is useful.

## Avoid when

Do not connect unrelated categories with a line or imply precision/time continuity the data does not have. For a few independent categories, use a table or bar chart.

## Structure

Use `LineChart` with ordered time/value data, a descriptive accessible label, and axis labels that include units/context. UIify renders a data table fallback. Import the component entry for static rendering; use /client only for interactive points or live history.

## Responsive

Keep the data table available as the plot narrows. For live history, 'visibleCount' virtualizes older points and the table follows the visible window; provide another route to full history when users need it.

## States

The static component needs no JavaScript. Interactive points use labeled buttons; the client entry adds live readout behavior. Disable announcements for high-frequency streaming updates when repeated speech would overwhelm.

## Verify

Check exact values in the table, time/unit labels, trend description, keyboard point controls if enabled, data updates, and narrow viewport.

## Common mistake

A default “Line chart” name does not explain which measure, unit, or period the chart shows.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/images/complex/) (verified 2026-10-17)
