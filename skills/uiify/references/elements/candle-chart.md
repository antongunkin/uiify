# candle-chart

Binding: candle-chart

Ordered market-style observations need open, high, low, and close values in each time interval

## Use when

Ordered market-style observations need open, high, low, and close values in each time interval.

Set `locale` to format the default month and price axis labels; custom `xAxis` and `yAxis` labels replace those defaults.

## Avoid when

Do not use candlesticks for generic category comparisons or hide exact values in a visual glyph. This component visualizes data; it does not provide financial recommendations.

## Structure

Use `CandleChart` with ordered time/open/high/low/close data, a descriptive label, and axis labels. UIify includes a data table fallback. Use /client for interactive crosshair/readout or live virtualized history.

## Responsive

Keep exact OHLC values available when candles become narrow. In live mode, the table follows the visible candles; provide another way to reach full history if needed.

## States

The static chart works without JavaScript. Interactive candles support pointer selection and an announced readout; suppress high-frequency readout announcements for streaming data.

## Verify

Check each candle's values against the table, chronological ordering, axis/time labels, keyboard access to interactive controls, update behavior, and mobile viewport.

## Common mistake

Coloring rising and falling candles without a table and explicit value labels makes the chart's information unavailable to many users.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/images/complex/) (verified 2026-10-17)
