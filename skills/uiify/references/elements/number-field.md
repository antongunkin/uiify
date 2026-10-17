# number-field

Binding: number-field

Enter a numeric quantity with optional bounds and step controls.

## Use when

Enter a quantity for which numeric stepping and bounds are meaningful.

## Avoid when

Do not use a number field for identifiers, postal codes, card numbers, or values where spinbutton behavior is not useful; use a text input instead.

## Structure

Use NumberField.Root with NumberField.Input and the documented increment/decrement buttons when those actions help. Give the input an a clear visible label and explain units, min/max, and step before entry. Give icon-only increment/decrement buttons accessible names.

## Responsive

Keep the input and controls operable at narrow widths; do not make the input so small that the value is hard to inspect or edit.

## States

Show the current value and bounds clearly. Validate the same constraints on the server; browser-side constraints alone do not protect submitted data.

## Verify

Test typing, increment/decrement, keyboard operation, min/max/step boundaries, invalid values, and the accessible name of each icon-only control.

## Common mistake

Using number input for a numeric-looking identifier that must retain leading zeroes.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (verified 2026-10-17)
