# typography

Binding: typography

Style readable text while preserving document heading semantics.

## Use when

Text needs a role in a shared visual hierarchy, such as page title, section heading, body copy, or metadata.

## Avoid when

Do not add a typography wrapper to text that should inherit its surrounding style unchanged.

## Structure

Compose `Heading` and `Text` from `@gunkin/uiify`. `Heading.level` chooses the native h1–h6 element; `size`, `weight`, `tone`, `leading`, `align`, `measure`, and `wrap` control appearance independently.

## Responsive

Appearance props accept `base`, `sm`, `md`, and `lg` values. Prefer UIify's finite typography tokens and allow text to wrap as the available width changes.

## States

Typography components have no interactive state. Links and controls retain their own semantics and focus styles.

## Verify

Check heading order, line length, wrapping, contrast for semantic tones, and readability with long text, RTL, CJK, and zoom.

## Common mistake

Do not choose a heading tag only to get a desired font size. Preserve the document outline and choose appearance separately.

Related laws: references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-11-03)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-11-03)
