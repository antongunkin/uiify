# field

Binding: field

Keep a label and its form control together.

## Use when

Keep a form control, its label, instructions, and any validation message connected. Use visible labels that name the expected information; a placeholder is not a substitute.

## Avoid when

Do not use a field wrapper without a real form control, or hide instructions needed before the person enters a value.

## Structure

`Field` (`role="group"`) holds `FieldLabel htmlFor="x"` and a published control with `id="x"` (`Input`, `Textarea`, or `Checkbox`/`Switch` without their own `label`). Give `FieldDescription`/`FieldError` an `id` and list it in the control's `aria-describedby`. `orientation="horizontal"` puts a checkbox beside `FieldContent` (label and description). Stack fields in `FieldGroup`. Use `FieldTitle as="span"` inside a label.

Group related controls in `FieldSet` (native `fieldset`) with `FieldLegend` first (`variant="label"` for label size); each control keeps its own label.

`variant="card"`: choice card, see `radio-group`; its `FieldLabel` holds text only.

## Responsive

Keep help text close to the control and let long messages wrap. `orientation="responsive"` is a column until its `FieldGroup` (the size container) is 28rem wide, then a row.

## States

Native constraint validation (`required`, `type`) works without JavaScript. For application validation set `invalid` on the control (`aria-invalid`) and on `Field`, and render `FieldError` with the message on the server; without content it renders nothing. No CSS reveals errors.

## Verify

Click the label: its control gets focus. In the accessibility tree the control's description includes the error text when invalid. Check required, disabled, and long-message states.

## Common mistake

A description or error whose `id` is missing from the control's `aria-describedby` is never read (`screen-field-description`). `htmlFor` must equal the control's `id`. `FieldGroup` is a size container: in a shrink-to-fit context (inline flex row, popover) give it a width or it collapses.

Example: `references/examples/field-validation.md`.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) (verified 2026-10-17)
- [design-system.service.gov.uk](https://design-system.service.gov.uk/components/fieldset/) (verified 2026-10-17)
- [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/forms.html) (verified 2026-10-17)
