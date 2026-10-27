# table

Binding: table

Compare structured member records.

## Use when

Compare records across shared attributes in rows and columns. Use a list for a one-dimensional set of items and CSS grid for page layout.

## Avoid when

Do not use a table only to position content. Turn rows into cards only when people no longer need to compare values across records.

## Structure

Use `Table.Root`, `Table.Caption`, `Table.Header`, `Table.ColumnHeader`, `Table.Body`, `Table.Row`, and `Table.Cell` for native table structure. Give the table a caption or an accessible name and mark header cells so their relationship to data is clear. Keep action controls in a separate column. Align numbers to the end and use tabular numerals for easier comparison.

## Responsive

Preserve the table's row and column relationships. If columns need horizontal scrolling, prioritize which columns remain visible and make the overflow region usable with a keyboard. Do not squeeze text until values are unreadable.

## States

Distinguish an empty dataset from a filter with no matches. Communicate loading and errors, and keep selection or sort state visible when requested. The native table is Tier 0; row selection, sorting, and expansion require the `/client` entry. In that entry, use `TableClient.ColumnHeader.slotProps.sortButton` for the sortable control and `slotProps.input/label` on `TableClient.SelectAll` or `TableClient.RowSelect` for generated checkbox parts.

## Verify

Inspect the accessibility tree for the caption, header cells, and their data relationships. Navigate through the table at a narrow viewport and check any horizontal overflow with a keyboard. Test empty, no-match, loading, error, selected, and sorted states that the page supports.

## Common mistake

A grid of `div` elements can look like a table but does not provide native row and column header relationships.

Example: `references/examples/table-controls.md`.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/tables/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/table/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
