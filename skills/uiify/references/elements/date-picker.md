# date-picker

Binding: gap

Collect one calendar date using the browser’s native date control.

## Use when

Collect one calendar date without a time, such as a start or due date.

## Avoid when

Use a date-time control when time matters. Avoid replacing the native picker with a custom calendar unless the task requires behavior that has been tested for keyboard and assistive technology.

## Structure

Use a visible label with a native input of type date. Add min and max only when the constraints are real, explain them before entry, and associate error feedback with the field.

## Responsive

Allow the browser’s date UI to use the platform layout; keep the field within the available width and do not assume every browser displays the same picker.

## States

Distinguish an empty value, a valid date, and a date outside the allowed range. The submitted date value is a calendar date normalized as yyyy-mm-dd.

## Verify

Test keyboard entry and picker operation in target browsers, date bounds, visible format guidance, validation text, and narrow-screen behavior.

## Common mistake

Treating a date-only value as a timestamp with a time zone.

## Custom implementation

Use a labelled native input with type date. This app-level pattern does not add a UIify date-picker component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/instructions/) (verified 2026-10-17)
