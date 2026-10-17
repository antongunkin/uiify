# progress-bar

Binding: gap

Show determinate completion of a task.

## Use when

A task has measurable completion with a known range. Use native <progress> and provide a programmatic label.

## Avoid when

Do not use it for a quantity like disk space or a score; use <meter>. For unknown duration, omit value for indeterminate progress or use a labeled spinner.

## Structure

This is an app-level composition, not a UIify component. Associate a visible <label> with <progress>, set max and the current value, and add a text status if the exact progress matters to the task.

## Responsive

Keep the label and progress indicator together in reading order; allow the label and textual status to wrap on narrow screens.

## States

A present value is determinate; omit value when the amount completed is not known. Use a positive max and keep value within 0..max. Mark the described region busy while it is updating when appropriate.

## Verify

Check accessible name, min/max/current values, determinate and indeterminate states, changing value, completion message, and responsive layout.

## Common mistake

Fallback text inside <progress> is not its accessible label; associate an actual label or aria-label.

## Custom implementation

```html
<label for="upload-progress">Upload</label>
<progress id="upload-progress" value="3" max="5"></progress>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
