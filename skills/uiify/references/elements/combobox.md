# combobox

Binding: combobox

Search and choose from a long set of known options.

## Use when

Let the person filter and choose from a long list of known options. Use a native `select` or radio group for a short list; use a text input for unrestricted text.

## Avoid when

Do not use a combobox when people need to compare all options at once or when typing is not a useful way to find an option.

## Structure

`Combobox.Root` receives `items` with `label` and `value`. Give `Combobox.Input` a visible associated label or accessible name. Render filtered items with `Combobox.Content` and `Combobox.Item`; render `Combobox.Empty` only when the filtered list is empty. The multi-value mode uses `multiple` and supports tags.

## Responsive

Keep the input and selected value visible when the option popup opens. Let the popup scroll when the filtered list is long and keep the current option in view.

## States

Typing filters options. Arrow keys move the active option while DOM focus stays on the input; Enter selects the active option and Escape closes the popup. Skip disabled options; provide loading feedback in the page. In Tier 2, filtering and selection require JavaScript hydration; before hydration only server-rendered markup is present.

## Verify

Type a partial match, use ArrowDown and ArrowUp to move through results, press Enter to select, and Escape to close without selecting. Check no matches, disabled options, loading, selected value, narrow viewport, and the accessible input name.

## Common mistake

A combobox for four choices adds typing and keyboard behavior without helping people find an option.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (verified 2026-10-17)
