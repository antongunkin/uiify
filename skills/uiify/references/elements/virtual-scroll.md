# virtual-scroll

Binding: virtual-scroll

A genuinely large list or grid needs to render only the visible range and nearby rows to keep scrolling responsive

## Use when

A genuinely large list or grid needs to render only the visible range and nearby rows to keep scrolling responsive.

## Avoid when

Do not virtualize short lists. Avoid it when users need browser find-in-page, a complete static/print view, or reliable access to all rows without JavaScript unless you provide an alternative.

## Structure

Use `VirtualScroll` with stable unique item ids and a renderRow function. Keep the default list role for lists; use grid only when each row supplies the correct grid structure and keyboard model. Name the scroll region and provide a useful height/size estimate.

## Responsive

Choose vertical or horizontal orientation deliberately, set rowHeight or estimateRowHeight to match actual content, and test at narrow widths and zoom.

## States

This is a Tier 2 client component. It exposes visible rows with aria-posinset/aria-setsize; rows outside the rendered window are absent from the DOM. For high-value data, provide a non-virtualized route or export.

## Verify

Check keyboard scrolling/focus, screen-reader item positions and total size, first/last rows, dynamic row measurement, list updates with stable ids, anchor/follow behavior if used, and no-JS/print alternatives.

## Common mistake

A scroll container that exposes only visible rows can make the rest of the collection unreachable to find-in-page and some assistive workflows.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-posinset) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-setsize) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
