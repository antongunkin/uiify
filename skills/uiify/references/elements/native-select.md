# native-select

Binding: native-select

Choose one or several values from a fixed list.

## Use when

Choose one value from a finite list, especially when the form benefits from a native control. Add `multiple` to choose several values; `value` and `defaultValue` then accept string arrays and `onValueChange` receives every selected value in option order.

## Avoid when

Avoid a select when users must compare several options at once or when the task needs a richer search or selection interaction.

## Structure

Wrap `NativeSelect` in a native `<label>` as in the example. Alternatively, match a native label's or `FieldLabel`'s `htmlFor` to an explicit unique `id` on NativeSelect. Group related options with `optgroup`; an empty prompt is for an optional value. A `multiple` select submits one entry per selected option under the same `name`; keep `size` in mind because a multiple select renders as a listbox rather than a closed control.

## Responsive

Keep the native control usable at narrow widths and browser zoom; do not depend on a fixed-width option label.

## States

Preserve the selected value after validation errors. Use native disabled, required, and invalid form semantics.

## Verify

Confirm the label is announced, options can be selected by keyboard, and the chosen value survives an invalid submission.

## Common mistake

Replacing a native select with a custom popup without a clear interaction need.

Example: `node_modules/@gunkin/uiify/agents/examples/forms/select-basic.tsx`.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-16)
