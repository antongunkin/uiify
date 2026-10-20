# avatar

Binding: avatar

Identify a person or account with a compact image and fallback.

## Use when

A compact portrait or initials help distinguish a person near comments, participants, or account details.

## Avoid when

Do not rely on the avatar as the only visible way to identify a person. Skip it when it adds no information.

## Structure

`Avatar` requires `name` and `fallback`; the root is named as an image. Without `src`, it displays the fallback. With `src`, it renders an empty-alt image. Set `aria-hidden="true"` when adjacent visible text already names the person.

## Responsive

Choose `size` (`sm`, `md`, or `lg`) for a consistent compact footprint. Keep the person's visible name available in reading order where the surrounding composition needs it.

## States

The fallback is chosen when `src` is absent at render time. A later image-load failure does not replace it automatically.

## Verify

Unit and public-page tests check the accessible image name, fallback and empty-alt image markup, size attributes, and the adjacent visible-name pattern.

## Common mistake

Repeating the adjacent person's name in image alt text can announce the identity twice.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-19)
