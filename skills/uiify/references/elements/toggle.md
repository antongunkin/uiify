# toggle

Binding: toggle

Expose a binary value with a toggle-style presentation.

## Use when

Present one reversible binary value, such as whether a formatting option is active.

## Avoid when

Use a switch for a persistent on/off setting and ordinary buttons for one-time actions.

## Structure

Use the documented Toggle with its required id and label. It is backed by a native checkbox; keep the label stable so the checked state conveys the change.

## Responsive

Keep the label visible or provide an accessible name for an icon-only control. Preserve an adequate target at narrow widths.

## States

Expose checked and unchecked state and show it visually without relying on color alone. Disabled state should remain distinguishable.

## Verify

Use Space to toggle, check the announced checkbox state and stable name, and test keyboard focus and disabled behavior.

## Common mistake

Styling a checkbox as a toggle button while hiding its checked state from the visual presentation.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
