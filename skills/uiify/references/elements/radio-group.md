# radio-group

Binding: radio-group

Choose exactly one option from a related set.

## Use when

Ask people to select one value from a small, mutually exclusive set.

## Avoid when

Use checkboxes for independent options and a select when the choice set is too long to scan inline.

## Structure

`RadioGroup` (`div role="radiogroup"`) holds one `Field orientation="horizontal"` per option: `RadioGroupItem` (a native `input type="radio"`) with a literal `name` shared by every item, a `value` and an `id`, then `FieldLabel htmlFor` with that id. Select the initial option with `defaultChecked` on one item. Name the group with `aria-label`/`aria-labelledby`; inside `FieldSet` + `FieldLegend` leave `RadioGroup` unnamed, because the fieldset already names the group (one form per fieldset).
Choice cards: `Field orientation="horizontal" variant="card"` with `RadioGroupItem` and `FieldContent` holding `FieldLabel` (title text only) and `FieldDescription id`, listed in the item's `aria-describedby`. The label covers the card, so a click anywhere on it selects the option. Never wrap a `Field`, `FieldContent`, `div` or `p` in `FieldLabel`: a label may hold only text (`screen-label-content`). Put no links or buttons inside a card: the label overlay covers them.
The group has no `name`, `defaultValue`, `disabled` or `required`: a `div` has no native mechanism for them and Tier 0 has no context to pass them down. Use native props instead: `disabled` on an item (it dims its card), `required` on one item (it makes the whole name group required), or `<FieldSet disabled>` around the group. Also put `aria-disabled="true"` on a disabled card's `Field`: it marks the card as inactive, and inactive controls are exempt from WCAG 1.4.3 contrast; without it axe reports `color-contrast` on the dimmed description. Text inside a card cannot be selected: the label overlay covers it.

## Responsive

Use the documented orientation that matches the layout, and let long labels wrap without changing the option order.

## States

Keep exactly one selected value when a selection is required; if the form requires a choice, state that before entry. Preserve selection when validation fails.

## Verify

Test arrow-key movement, Tab entry/exit, label activation, disabled options, group naming, and submitted value.

## Common mistake

Presenting visually grouped radios without a programmatic group name, or giving items of one group different or missing `name`s: the browser then does not group them (`screen-radio-name`).

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
