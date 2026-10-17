# field

Binding: field

Keep a label and its form control together.

## Use when

Keep a form control, its label, instructions, and any validation message connected. Use visible labels that name the expected information; a placeholder is not a substitute.

## Avoid when

Do not use a field wrapper without a real form control, or hide instructions needed before the person enters a value.

## Structure

Use `Field.Root`, `Field.Label`, `Field.Control`, `Field.Description`, and `Field.Error` with the same `id` on Root and `fieldId` on every part. Put native props such as `name`, `type`, and `autoComplete` on `Field.Control`. Pass `invalid`, `required`, and `disabled` to the parts that need those states; Root does not inject props into them.

## Responsive

Keep labels and help text close to the control at narrow widths. Let long instructions and error messages wrap without clipping.

## States

Native required validation works without JavaScript. For application validation, set `invalid` on Root and Control and render `Field.Error` with the same state after validation. The control's accessible description includes the error while invalid.

## Verify

Click the label and confirm its control receives focus. Inspect the accessibility tree for the control's name and associated description; submit an invalid value and confirm a textual error appears and is announced. Check required, disabled, read-only, and long-message states.

## Common mistake

A label and control with different `fieldId` values disconnect the visible label from the input and its instructions.

Example: `references/examples/field-validation.md`.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) (verified 2026-10-17)
