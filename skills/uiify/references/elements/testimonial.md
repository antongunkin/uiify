# testimonial

Binding: gap

Attribute a customer quote to a named source.

## Use when

A real customer quotation adds useful evidence to a product or service claim.

## Avoid when

Do not invent a quote, imply an endorsement that was not given, or use a testimonial as the only source for a factual claim.

## Structure

Mark the quoted words with `blockquote` and keep the attribution in a `figcaption` of the same `figure`, with an `Avatar` if one is shown. Keep the quote and its speaker together.

## Responsive

Let the quotation wrap at a readable line length. Keep attribution adjacent on narrow screens and do not crop text into an image.

## States

If quotes rotate, provide labeled controls and user control over rotation; otherwise prefer a static quote.

## Verify

Check quote accuracy and attribution, semantic quotation markup, text contrast, reading order, and keyboard access for any controls.

## Common mistake

A decorative quotation mark does not identify who said the words.

## Custom implementation

This is an app-level composition; UIify does not ship a testimonial component. Use a `figure` with a `blockquote` for the quoted words and a `figcaption` for the attribution, with an optional `Avatar`.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote) (verified 2026-10-16)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
