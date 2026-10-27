# tags-input

Binding: tags-input

Enter and manage a set of text tokens such as recipients or filters.

## Use when

Let people enter multiple free-form values as removable tokens.

## Avoid when

Use a select or checkbox group for a fixed choice set. Do not add suggestion-list semantics unless the complete combobox interaction is implemented.

## Structure

Use TagsInput.Root with the documented List, Tag, TagRemove, and Input parts. Root, List and TagRemove accept native DOM props. List's generated tag entries accept `slotProps.tag`, addressed by list index through `byItemIndex`; its generated input wrapper accepts `slotProps.input`. Give the text input a clear accessible name and keep each remove control adjacent to its tag. UIify currently names each one “Remove tag”; verify that the tag context is announced when moving among removal controls.

## Responsive

Allow tags to wrap and the input to remain reachable as the list grows. Keep remove controls visible and operable at narrow widths.

## States

Communicate validation, duplicate values, and maximum-tag limits in text. Preserve existing tags when one value is rejected.

## Verify

Test adding, removing, paste and delimiter behavior, duplicate and limit cases, keyboard access, accessible names, and long lists. If removal controls are ambiguous in the target assistive technology, use custom controls with names that include the tag value.

## Common mistake

Rendering tags as decorative chips with no accessible way to identify or remove each value.

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
