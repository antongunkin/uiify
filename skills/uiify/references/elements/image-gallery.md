# image-gallery

Binding: gap

Show related images with useful captions or alternatives.

## Use when

A related set of images benefits from being browsed together with captions or contextual text.

## Avoid when

Do not build a gallery if one image answers the need. Do not hide the only useful visual information behind a lightbox with no inline alternative.

## Structure

This is an app-level composition, not a UIify component. Use a list of figures. Write alt text for the image's purpose; use figcaption for additional context, avoiding redundant repetition.

## Responsive

Prefer existing project assets. Keep images within their container, preserve intrinsic ratio and important content in responsive crops, and allow the list to stack. Provide intrinsic width and height to reduce layout shift.

## States

If images open a larger view, use a real link or button with an accessible name and a way back. Do not imply gallery navigation when items are static.

## Verify

Check informative/decorative alternatives, captions, loading and intrinsic dimensions, keyboard access for interactive images, and narrow reflow.

## Common mistake

Using the same sentence as both alt text and caption can produce repetitive announcements when both convey identical information.

## Custom implementation

```html
<ul>
  <li><figure>
    <img src="/bridge.webp" width="640" height="400" alt="Stone bridge over a river" />
    <figcaption>Old town bridge at dusk</figcaption>
  </figure></li>
</ul>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure) (verified 2026-10-16)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-16)
