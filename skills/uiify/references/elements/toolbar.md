# toolbar

Binding: toolbar

Group three or more related controls with a compact keyboard navigation model.

## Use when

Group at least three related controls that act on the same object or task.

## Avoid when

Do not use toolbar semantics for a small set of unrelated actions or when controls need their own ordinary Tab stops.

## Structure

Use the documented Toolbar.Root with an accessible name and a consistent orientation. Use buttons for actions, links for navigation, and selected state only for toggle buttons.

## Responsive

Let controls wrap only if arrow-key movement still follows a predictable order; otherwise provide a scrollable group or switch to ordinary controls with Tab navigation.

## States

The toolbar uses one Tab stop with arrow-key movement among enabled controls. Disabled controls are skipped; expose toggle state with the documented selected button behavior.

## Verify

Test Tab entry/exit, arrow movement, orientation, disabled items, toggle announcements, and operation with a keyboard.

## Common mistake

Adding role="toolbar" without implementing its expected arrow-key focus management.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) (verified 2026-10-17)
