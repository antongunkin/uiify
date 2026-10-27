# segmented-control

Binding: segmented-control

Choose one value from a short set of mutually exclusive options.

## Use when

Let people switch among a few short, mutually exclusive values, such as a billing period or view mode.

## Avoid when

Use ordinary links for navigation and Tabs only when each choice opens a corresponding panel. Prefer a select for many options or long labels.

## Structure

Use SegmentedControl with a stable id and items that each have a value and label. Give the group an accessible name, and show the selected option with the component's native radio semantics.
Style generated item wrappers, radios, and labels with `slotProps.item`, `slotProps.input`, and `slotProps.label`. Use `byItemValue` when one segment needs its own props or `data-testid`.

## Responsive

Allow the group to fit or stack at narrow widths without truncating labels or shrinking the targets.

## States

Keep one value selected and update the associated content or setting when the selection changes. Use the documented client entry only when controlled state is required.

## Verify

Test arrow-key selection, keyboard focus, group name, visible selected state, narrow-width layout, and that dependent content reflects the chosen value.

## Common mistake

Styling unrelated navigation links as segmented options and hiding their link behavior.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/grouping/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
