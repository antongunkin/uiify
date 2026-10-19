# button

Binding: button

Expose a clear action with its native interaction semantics.

## Use when

The person triggers an action on this page: submit a form, save, confirm, open a dialog or start a flow. `as="a"` gives a link the Button skin; the element stays a link.

## Avoid when

The control moves to another page: use a link (`<a href>` or `Button as="a"`). For a persistent or mutually exclusive choice, use `segmented-control` or `toggle-group` when its interaction model fits. `selected` can also mark a button as the chosen item in a set.

## Structure

One visible label names the result with a verb: "Save changes", "Invite member". An icon-only button (`size="icon"`) needs a non-empty accessible name; `aria-label` or visually hidden text can provide it.

```tsx
<Button type="submit">Save changes</Button>
<Button variant="ghost">Cancel</Button>
```

`Button` renders a native `<button>` with `type="button"` unless `type` is given; pass `type="submit"` inside a form.

## Responsive

Labels fit at 320 CSS px without truncation; shorten the copy rather than the target. In a narrow action row keep the primary action first in reading order and let the buttons wrap or stack instead of hiding one.

## States

Disabled: say nearby why the action is unavailable, or keep it enabled and validate on submit. Busy: keep the label and width, show progress text such as "Saving…" and ignore a second press. `selected` marks the chosen button in a set or a toggle that stays on.

## Verify

Enabled native buttons follow Tab order and activate with Enter or Space. A disabled button cannot activate; `as="a"` keeps link keyboard behavior. Every control has a visible focus indicator and a non-empty accessible name. A single solid action can clarify emphasis in a decision area; treat that as a contextual heuristic.

## Common mistake

When two actions have similar priority, giving both the strongest treatment can make the hierarchy unclear. Consider `variant="outline"` or `"ghost"` for the secondary action, and reserve `variant="destructive"` for actions that remove or irreversibly change data.

Related laws: references/laws/von-restorff.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/button/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (verified 2026-10-17)
