# badge

Binding: badge

Mark a short status or category beside related content.

## Use when

A short visible label helps people scan the state or category of nearby content.

## Avoid when

Do not use Badge as a control, for long explanations, or for status conveyed by color alone.

## Structure

`Badge` renders a text `span`. Its `variant` (`secondary`, `success`, `warning`, or `destructive`) and `size` (`sm`, `md`, or `lg`) write `data-variant` and `data-size`. Keep the state or category in the text.

## Responsive

Keep labels concise and attached to the related content in reading order. Check long translated text and zoom.

## States

Badge is static text. It does not add a role, keyboard behavior, selection state, or live announcement.

## Verify

Unit tests check the native span, text, optional attributes, root props and ref. Check contrast and meaning without color in the consumer's chosen theme.

## Common mistake

A colored dot or a green background without a textual status does not explain the state.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-19)
