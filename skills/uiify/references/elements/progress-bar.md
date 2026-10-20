# progress-bar

Binding: progress

Show determinate or indeterminate progress for a task.

## Use when

Show the completion of a task with a known range, or use indeterminate progress when the amount completed is unknown.

## Avoid when

Do not use Progress for a static measurement or score; use `meter` for a measured quantity.

## Structure

`Progress` renders native `<progress>`. Set `value` and a positive `max` for a known amount; omit `value` for indeterminate progress. Give it an accessible name with an associated `<label>`, `aria-label`, or `aria-labelledby`.

## Responsive

Keep the label and indicator together in reading order. The optional skin fills the available inline size; native browser rendering can differ.

## States

The browser exposes determinate or indeterminate semantics from the native attributes. UIify does not simulate value changes or announce them.

## Verify

Unit and public-page tests check native determinate and indeterminate markup and an associated label. In the consuming page, keep `value` between zero and `max` and check the accessible name.

## Common mistake

Text inside `<progress>` is not its accessible name; associate a label or provide an ARIA name.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-19)
