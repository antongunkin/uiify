# testimonial

Binding: gap

Attribute a customer quote to a named source.

## Use when

A real customer quotation adds useful evidence to a product or service claim.

## Avoid when

Do not invent a quote, imply an endorsement that was not given, or use a testimonial as the only source for a factual claim.

## Structure

This is an app-level composition, not a UIify component. Mark the quoted words with blockquote and include a clear attribution in a nearby caption or paragraph. Keep the quote and its speaker together.

## Responsive

Let the quotation wrap at a readable line length. Keep attribution adjacent on narrow screens and do not crop text into an image.

## States

If quotes rotate, provide labeled controls and user control over rotation; otherwise prefer a static quote.

## Verify

Check quote accuracy and attribution, semantic quotation markup, text contrast, reading order, and keyboard access for any controls.

## Common mistake

A decorative quotation mark does not identify who said the words.

## Custom implementation

```html
<figure>
  <blockquote cite="/customers/acme">
    <p>Our team can find the latest project status quickly.</p>
  </blockquote>
  <figcaption>Jordan Lee, Operations Lead</figcaption>
</figure>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote) (verified 2026-10-16)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
