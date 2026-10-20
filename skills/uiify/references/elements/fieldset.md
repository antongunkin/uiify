# fieldset

Binding: fieldset

Give related form controls a native group name with a legend.

## Use when

Related controls need a native group name, such as contact preferences or one radio question.

## Avoid when

Do not wrap every individual field in a fieldset or use one for unrelated controls.

## Structure

`Fieldset` renders `fieldset`; put `FieldsetLegend` (`legend`) first. The legend names the group, not each control. Give every input its own label. Compose published `Checkbox` controls for checkbox choices; `name` and `value` preserve native form submission. Keep caller-authored help/error relationships and native fieldset props.

## Responsive

Let legend and labels wrap in source order. Style the native outer group without obscuring descendant focus.

## States

Preserve native `disabled`: it disables descendant controls except controls inside the first legend. The component adds no synthetic group role or hidden legend.

## Verify

Check first-child legend, individual labels, group announcement, keyboard access, disabled descendants, RTL, and narrow/zoom reflow. Browser and assistive-technology proof is pending.

## Common mistake

Do not use `role="group"` on a `div` instead of native fieldset/legend semantics, or treat the legend as a control's label.

## Sources

- [design-system.service.gov.uk](https://design-system.service.gov.uk/components/fieldset/) (verified 2026-10-19)
- [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/forms.html) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset) (verified 2026-10-19)
