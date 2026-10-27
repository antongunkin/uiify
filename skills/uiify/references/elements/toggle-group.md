# toggle-group

Binding: toggle-group

Select one or several related options as a group of toggles.

## Use when

Present a compact set of related options whose selected values affect the same view or object.

## Avoid when

Use ordinary links for navigation, Tabs for switching associated panels, and checkboxes for a form list that benefits from visible labels and descriptions.

## Structure

Use ToggleGroup with a stable id, a group name, and items with values and labels. Set type to single for one choice or multiple for independent choices.
Style generated item wrappers, inputs, and labels with `slotProps.item`, `slotProps.input`, and `slotProps.label`. Use `byItemValue` when one toggle needs its own props or `data-testid`.

## Responsive

Let labels wrap or stack without changing the option order or hiding selected values. Keep targets usable at narrow widths.

## States

Show selected and unselected values clearly. In single mode, keep a valid selection when one is required; in multiple mode, allow the documented independent selection behavior.

## Verify

Test arrow-key operation, group name, single/multiple selection, disabled items, selected-state announcement, and keyboard focus.

## Common mistake

Using a toggle group for navigation or tabs when options do not represent selection on the same content.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
