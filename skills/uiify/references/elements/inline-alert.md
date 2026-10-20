# inline-alert

Binding: alert

Give a short persistent message context beside the content it affects.

## Use when

A message belongs beside the content or control it explains and should remain visible.

## Avoid when

Do not use a persistent alert for transient success or add an assertive live role to routine initial content.

## Structure

Compose `Alert`, `AlertTitle`, and `AlertDescription` from `@gunkin/uiify/components/alert`. The static root owns `data-uiify-alert` and a `data-variant` (default `secondary`). It supplies a decorative text symbol: ⓘ, ✓, ⚠︎, or × for `secondary`, `success`, `warning`, or `destructive`. Pass `symbol="!"` to override it or `symbol={false}` to hide it. No SVG or demo layout is needed. Title/description expose `data-part="title|description"`; the built-in glyph is `data-part="symbol"`. The component adds no `role` by default.

## Responsive

Keep the message beside affected content. The optional package stylesheet handles wrapping, logical symbol placement and part typography. With Tailwind, style those same attributes/parts. Keep severity in the title or description; the glyph is hidden from assistive technology.

## States

Pass `role="status"` for a dynamic non-urgent update or `role="alert"` for urgent content only when timing and urgency warrant announcement. Alert does not dismiss or move focus.

## Verify

Check every variant, a hidden/custom symbol, default role, native props/ref forwarding and copied CSS/Tailwind code. For dynamic messages, test actual announcement timing and avoid duplicate live regions.

## Common mistake

Use the real `variant` instead of making every outcome `secondary` and rebuilding its icon/layout in a demo wrapper. `role="alert"` is only for an urgent announcement.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-19)
