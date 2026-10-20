# aspect-ratio

Binding: aspect-ratio

Frame media at a preferred proportion as available inline size changes.

## Use when

Media needs a stable shape as available inline size changes.

## Avoid when

Text or controls must determine height. Keep captions outside the frame; preserve meaningful image detail.

## Structure

```tsx
import { AspectRatio } from "@gunkin/uiify";
import "@gunkin/uiify/components/behavior.css";

<AspectRatio ratio={16 / 9} className="media-frame">
  <img src="/landscape.jpg" alt="Mountain lake" width={1600} height={900} />
</AspectRatio>
```

Direct import: `@gunkin/uiify/components/aspect-ratio`. This importable Block is Tier 0. It renders two wrappers: root `data-uiify-aspect-ratio`, then `data-part="content"` around children. Root forwards native props, events, `className`, `style`, `ref`, `as` and `render`; custom renderers must forward props/ref. Owned markers cannot be overridden.

`ratio?: number` accepts a positive finite number (width/height). Square default: `1`; invalid numbers fall back to `1`. Omission leaves the stylesheet default and permits a CSS `--uiify-aspect-ratio` override; an explicit ratio writes that property.

## Responsive

Let the parent constrain width. Required behavior CSS uses native `aspect-ratio` and absolute content to isolate intrinsic child sizing. Media fit and visuals are optional consumer CSS:

```css
.media-frame [data-part="content"] > img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

Use `contain` to retain the whole image. The component imposes no fitting or clipping on arbitrary children.

## States

Static sizing has no loading, playback, focus or hydration state and needs no client JavaScript.

## Verify

Check square, 16:9 and 4:5 frames with scripts disabled at narrow/wide widths, oversized intrinsic media, cover/contain crops, RTL and CJK captions at 200% text size. Check embeds' keyboard behavior separately.

## Common mistake

Definite width and height defeat preferred-ratio sizing. Avoid JS measurement, padding emulation, or meaningful text inside the media area.

## Sources

- [www.radix-ui.com](https://www.radix-ui.com/primitives/docs/components/aspect-ratio) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio) (verified 2026-10-19)
