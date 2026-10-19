# carousel

Binding: carousel

Present a labeled sequence of related slides with native scrolling and optional controls.

## Use when

A short sequence of related slides saves space and users benefit from viewing one or a subset at a time. Prefer direct scrolling when all items should remain discoverable together.

Set `locale` to format the announced slide position; provide translated `slide` and `goToSlide` label templates with `{index}` and `{count}` or `{label}` placeholders.

## Avoid when

Do not hide essential information in offscreen slides or auto-rotate content without a clear user need and an operable stop/restart control.

## Structure

Use `Carousel` with a stable id, descriptive aria-label, and items with unique ids and labels. The base entry is a native scroll-snap region with fragment links; navigation controls and synchronized state are in /client.

## Responsive

Use inline axis for horizontal slides and preserve native scrolling/scroll snap. Ensure neighboring content does not make the current slide ambiguous and controls remain reachable.

## States

Prefer manual operation. The client API supports autoplay with a rotation control and stops on keyboard focus, but it does not currently pause on pointer hover. Leave autoplay disabled unless the app adds hover pausing. The base entry works without JavaScript.

## Verify

Check accessible carousel label, slide labels, previous/next and pagination names, fragment navigation without JavaScript, keyboard control, focus behavior, and mobile scrolling. If autoplay is used, verify pause/restart and that rotation does not obscure slide reading.

## Common mistake

Dot-only controls with no meaningful accessible names do not tell users which slide they will select.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
