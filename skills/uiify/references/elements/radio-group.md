# radio-group

Binding: radio-group

Choose exactly one option from a related set.

## Use when

Ask people to select one value from a small, mutually exclusive set.

## Avoid when

Use checkboxes for independent options and a select when the choice set is too long to scan inline.

## Structure

Use RadioGroup with a stable id, a name, and items that each have a value and descriptive label. Give the group a visible legend or an accessible name that describes the question.
Style generated item wrappers, radios, and labels with `slotProps.item`, `slotProps.input`, and `slotProps.label`. Use `byItemValue` when one option needs its own props or `data-testid`.

## Responsive

Use the documented orientation that matches the layout, and let long labels wrap without changing the option order.

## States

Keep exactly one selected value when a selection is required; if the form requires a choice, state that before entry. Preserve selection when validation fails.

## Verify

Test arrow-key movement, Tab entry/exit, label activation, disabled options, group naming, and submitted value.

## Common mistake

Presenting visually grouped radios without a programmatic group name.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
