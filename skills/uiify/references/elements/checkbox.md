# checkbox

Binding: checkbox

Select one or more independent options.

## Use when

Let people independently select any number of options, including none.

## Avoid when

Use a radio group when exactly one option can be selected. Use a switch for a single immediate on/off setting.

## Structure

Use the documented Checkbox with a stable id and a visible, descriptive label. For form submission, provide its native `name` and `value`. Use `slotProps.input` and `slotProps.label` to style or annotate the generated native input and wrapping label. The top-level `className` remains a label shortcut. Group related choices with CheckboxGroup: a native fieldset, an optional visible legend from `label`, and an items array. Use CheckboxGroupClient from the /client entry for `value[]`/`onValueChange`, `required`/`invalid` state hooks and the optional `selectAll` aggregate. Use CheckboxClient from the /client entry for the native mixed state; static `aria-checked` alone is not a real mixed checkbox.

## Responsive

Let each label wrap without reducing the control's usable hit area. Stack choices when inline labels no longer fit; use `orientation="horizontal"` for a wrapping row.

## States

Make checked, unchecked, disabled, and any mixed aggregate state clear. Preserve selections when validation or another form field fails. The group's `required` sets `data-required` only; implement "select at least one" validation in the consumer or Field, and pass `invalid` once validation fails.

## Verify

Click both the control and its label, use Space from the keyboard, and test independent selection, group naming, disabled items, the select-all all/some/none states, and FormData submission under the shared `name`.

## Common mistake

Using checkboxes for mutually exclusive options or showing mixed state without an aggregate relationship.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
