# avatar

Binding: gap

Identify a person or account with a compact image and fallback.

## Use when

A person's identity helps distinguish nearby content, such as a participant list or comment author.

## Avoid when

Do not add a portrait when the name already provides all needed context and the image adds no information. Do not use an avatar as the only way to identify a person.

## Structure

This is an app-level composition, not a UIify component. Use an img with concise alt text when the portrait adds identity; use alt="" when visible adjacent text already names the person. Keep the name as text.

## Responsive

Set intrinsic dimensions to reserve space, preserve a consistent crop, and avoid shrinking the image below its useful size.

## States

Provide a stable initials or generic fallback when no usable image exists. If the image fails, keep the person's visible name.

## Verify

Check image alternative against nearby text, loading/failure fallback, intrinsic dimensions, and list reading order.

## Common mistake

Repeating the adjacent name in alt text makes assistive technology announce the same identity twice.

## Custom implementation

```html
<img src="/people/ada.webp" width="40" height="40" alt="" />
<span>Ada Lovelace</span>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-16)
