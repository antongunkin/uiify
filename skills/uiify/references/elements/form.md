# form

Binding: form

Collect the information needed to complete one task.

## Use when

Collect the information needed to complete one task, such as signing in, registering, or purchasing. Ask only for information the task needs.

## Avoid when

Do not make a form for a collection of unrelated actions or for navigation alone.

## Structure

`Form` renders a native `<form>` and uses browser validation by default. Label every control; group related choices with `fieldset` and `legend`. Put one clearly named submit action after the fields. `validationBehavior="aria"` sets `noValidate`, so the page must provide its own accessible validation.

## Responsive

A single column is a useful default on narrow screens. Keep each label, control, and its instructions together when the layout changes; UIify `Form` does not impose visual layout.

## States

Support invalid submission, pending submission, success, and server error. Show detected errors in text, identify each affected field, and keep entered values after failure so the person can correct them.

## Verify

Submit empty and malformed values. Confirm browser validation or the page's own validation is active, errors identify the affected controls in text, values remain available after failure, and success and server-error messages are clear.

## Common mistake

Disabling submit before explaining validation can leave people stuck. Let the form explain what needs correction.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) (verified 2026-10-17)
