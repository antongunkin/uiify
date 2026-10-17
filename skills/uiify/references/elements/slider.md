# slider

Binding: slider

Set a value within a continuous or stepped range.

## Use when

Let people adjust a value within meaningful lower and upper bounds.

## Avoid when

Use a number field when people need exact numeric entry or the range has too many meaningful values to scan.

## Structure

Use the documented Slider for one value and label it with the quantity and units. State the current value in adjacent text when it is not otherwise clear; set min, max, and step to match the task. Use SliderClient for a range with two thumbs, labels, or marks.

## Responsive

Keep the track and thumb operable at narrow widths. Do not communicate the selected value by thumb position or color alone.

## States

Expose the current value, bounds, step, and disabled state. Keep a numeric text entry alternative when precise adjustment is important.

## Verify

Test keyboard adjustment, endpoints, step increments, accessible name and value, touch screen-reader operation, and any alternative numeric entry.

## Common mistake

Showing a slider without a visible label or a way to understand its current value.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
