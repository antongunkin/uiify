# cookie-banner

Binding: gap

Explain cookie choices and provide consent actions.

## Use when

A product needs to explain its cookie/storage choices and provide a clear route to the detailed policy and preference controls.

## Avoid when

Do not obscure the primary task with a full-screen interruption when a compact notice works. Do not imply that a button choice is legally sufficient in every jurisdiction; match the product's actual consent policy.

## Structure

This is an app-level composition, not a UIify component. State what optional storage is used for, link to the policy, and present distinct choices with similarly clear labels.

## Responsive

Keep the notice readable at mobile widths and zoom; allow the page to remain usable and make every choice reachable without horizontal scrolling.

## States

Represent the actual consent state: undecided, accepted/rejected as supported by policy, and preference editing. Persist only the choice the person made, and provide a way to revisit preferences.

## Verify

Check keyboard operation, policy link, clear action labels, focus order, narrow layout, persistence behavior, and that the choices match the implementation and applicable policy.

## Common mistake

Do not hide rejection behind multiple steps while acceptance is a single prominent button.

## Custom implementation

```html
<aside aria-labelledby="cookie-title">
  <h2 id="cookie-title">Cookie choices</h2>
  <p>Choose whether to allow optional cookies.</p>
  <button type="button">Allow optional cookies</button>
  <button type="button">Reject optional cookies</button>
</aside>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
