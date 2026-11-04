# combobox

Binding: combobox

Search and choose from a long set of known options.

## Use when

Filter long option lists. Prefer native select/radios for short lists, Input for unrestricted text.

## Avoid when

Do not use it when all choices should stay visible or typing does not improve discovery.

## Structure

`Root.items` uses string `label`/`value`. Single `null` means no selection; `""` is a valid ID. Query and selection are separate. Adapt records once with `createComboboxItems(records, { getValue, getLabel, isDisabled })`; `getItem(value)` returns the source record. Duplicate IDs throw. Give `Input` an accessible name. Use stable value keys. Rich option children stay non-interactive; keep its name tied to `item.label`, hide decorative avatars, and link details using `aria-describedby`. Link `Group` to visible `GroupLabel` with `aria-labelledby`; omit empty groups. Headings are not options. Use `Empty` only when idle with no matches; put consumer-managed status in `Combobox.Status`.

## Responsive

Keep input and selections visible on narrow screens. Consumer classes merge.

## States

Opt into native forms with one `FormControl name="person" required`. It renders only selected IDs in a hidden multiple select, including `""`; query `Input.name` is separate. Invalid submission focuses Input unless consumer cancels `onInvalid`. Programmatic reset settles after a microtask; native reset may settle next task to honor cancellation. Controlled owners stay authoritative. `form` supports external owners. SSR includes selected entries; picker interaction requires hydration.

Arrows move the active option while focus stays on input; Enter selects, Escape closes. Active and selected differ. Skip disabled options and keep active in view. `Root.disabled` blocks model changes and follows disabled fieldsets. `loading` suppresses Empty. Multiple mode uses `Tags.slotProps`. Single custom values commit on Enter only if enabled and valid. Async consumers own request cancellation, ignore late results, retain selected records outside current results, and wait for IME composition to end.

## Verify

Test selection, IDREFs, loading, disabled, races, IME, narrow layout, native submission/required, cancellation and controlled reset. Forms tested in Chromium/WebKit; Firefox unverified.

## Common mistake

Do not build a Combobox for four static choices.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) (verified 2026-10-17)
- [base-ui.com](https://base-ui.com/react/components/combobox) (verified 2026-10-17)
- [react-aria.adobe.com](https://react-aria.adobe.com/ListBox) (verified 2026-10-17)
