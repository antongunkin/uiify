# code-block

Binding: gap

Present source text with preserved whitespace.

## Use when

People need to read or copy source text while preserving whitespace and line breaks.

## Avoid when

Do not put prose in preformatted code or make copying the only way to access the content. Avoid horizontal overflow that hides important lines without an intentional scroll container.

## Structure

This is an app-level composition, not a UIify component. Use pre > code for code and a figure/figcaption when a caption identifies the example. Add a clearly named copy button only when copy is implemented; report success in a status region.

## Responsive

Allow code to wrap when that preserves readability, or provide a clearly scrollable region with keyboard access. Keep captions and copy controls reachable at narrow widths.

## States

Represent copy idle/success/failure in text. Do not announce every code line; preserve code as selectable text.

## Verify

Check whitespace, language/description context, keyboard scrolling, copy action name and announcement, zoom, and line wrapping.

## Common mistake

An icon-only copy button with no accessible name gives no indication of its action.

## Custom implementation

```html
<figure>
  <figcaption>Install the package</figcaption>
  <pre><code>npm install uiify</code></pre>
</figure>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre) (verified 2026-10-16)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
