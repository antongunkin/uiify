# popup

Binding: popup

A small, optional piece of contextual content belongs beside its trigger and can be opened without blocking the page

## Use when

A small, optional piece of contextual content belongs beside its trigger and can be opened without blocking the page. Use it for a short explanation, compact detail, or lightweight choice.

## Avoid when

Do not use a popup for an urgent alert, a task requiring modal focus containment, or essential information available only on hover. Use a menu for a set of commands.

## Structure

Use `PopupTrigger` with a stable target id and matching PopupContent; add PopupClose when users need an explicit close action. Keep content concise and label interactive controls.

## Responsive

Let content wrap and keep it within the viewport at narrow widths and zoom. Check the chosen side and alignment around viewport edges.

## States

Tier 0 native popover parts work without client JavaScript. 'mode="auto"' supports light dismissal; 'manual' requires explicit dismissal. The parts do not set 'aria-expanded'; cross-engine exposure is not yet established.

## Verify

Test invoker by pointer and keyboard, close behavior for the chosen mode, focus order, target id wiring, and placement at narrow widths. Inspect the accessibility tree in each supported browser; do not assume expanded state is exposed identically.

## Common mistake

Do not put essential instructions only in content that appears on hover.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) (verified 2026-10-17)
