# color-picker

Binding: color-picker

Let people choose a color value for a specific purpose.

## Use when

Let people set a color such as a theme accent or drawing color.

## Avoid when

Do not use color as the only way to choose or identify a required category. Use a finite labelled choice set when only a few named colors are allowed.

## Structure

Use the documented ColorPicker with its required visible label. Choose the documented colorSpace and alpha options to match the stored value; show the current color value as text as well as a swatch.

## Responsive

Keep the label, picker control, and current value visible within narrow layouts.

## States

Preserve the selected color and communicate any invalid or disabled state. The native picker UI may vary by browser and operating system.

## Verify

Test the accessible name, keyboard use, color value serialization, alpha and color-space requirements, and the browser’s picker behavior. Check that meaning is not conveyed by color alone.

## Common mistake

Showing a swatch without text that lets people inspect or identify its value.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
