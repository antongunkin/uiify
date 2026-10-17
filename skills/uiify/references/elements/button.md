# button

Binding: button

Expose a clear action with its native interaction semantics.

## Use when

The person triggers an action on this page: submit a form, save, confirm, open a dialog or start a flow. `as="a"` gives a link the Button skin; the element stays a link.

## Avoid when

The control moves to another page: use a link (`<a href>` or `Button as="a"`). A choice between options is a `segmented-control` or `toggle-group`, not several buttons.

## Structure

One visible label names the result with a verb: "Save changes", "Invite member". An icon-only button (`size="icon"`) needs an accessible name through `aria-label`.

```tsx
<Button type="submit">Save changes</Button>
<Button variant="ghost">Cancel</Button>
```

`Button` renders a native `<button>` with `type="button"` unless `type` is given; pass `type="submit"` inside a form.

## Responsive

Labels fit at 320 CSS px without truncation; shorten the copy rather than the target. In a narrow action row keep the primary action first in reading order and let the buttons wrap or stack instead of hiding one.

## States

Disabled: say nearby why the action is unavailable, or keep it enabled and validate on submit. Busy: keep the label and width, show progress text such as "Saving…" and ignore a second press. `selected` only for a toggle that stays on.

## Verify

Tab reaches every button in reading order with a visible focus indicator; Enter and Space activate it. One default (solid) button per decision area. Icon-only buttons have a non-empty name in the accessibility tree.

## Common mistake

Two solid buttons side by side, such as "Save" and "Delete", make people compare colors instead of labels. Keep one solid action, use `variant="outline"` or `"ghost"` for the alternative and `variant="destructive"` only where data is removed.

Related laws: references/laws/von-restorff.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/button/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (verified 2026-10-17)
