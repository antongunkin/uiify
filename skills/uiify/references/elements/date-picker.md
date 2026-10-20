# date-picker

Binding: date-picker

Collect one calendar date with the browser’s native date input.

## Use when

Collect one calendar date without a time, such as a start or due date.

## Avoid when

Use a date-time control when time matters. Do not replace the native picker with a custom calendar unless its keyboard and assistive-technology behavior is in scope and tested.

## Structure

`DatePicker` renders a native `input[type="date"]`. It accepts native input props and ref except `type`, which is fixed; `invalid` sets `aria-invalid` and `data-invalid`. Add a separate visible label and caller-owned help/error relationships. Use `min`, `max`, `required`, `name`, and `value` only as needed. The submitted date is `yyyy-mm-dd`; display and picker UI belong to the browser and locale.

## Responsive

The optional stylesheet styles only the outer control: border, surface/text, typography, logical padding, minimum inline size, focus, invalid, and disabled state. Preserve native `appearance`, picker icon, and calendar internals.

## States

Preserve native empty/value, required, bounds, disabled, and invalid behavior. Revalidate on the server; a date-only value is not a timestamp or time-zone value.

## Verify

Test label, native entry/picker, submitted value, required/bounds, visible focus, invalid/disabled style, and narrow layout with JavaScript disabled. Browser picker operation and visuals remain unverified until each target engine is exercised.

## Common mistake

Do not add a custom calendar, convert the date to a time-zone timestamp, style vendor-only picker pseudo-elements, or use a placeholder as the only label.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) (verified 2026-10-19)
- [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/input.html) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-19)
