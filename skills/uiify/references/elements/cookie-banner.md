# cookie-banner

Binding: gap

Explain cookie choices and provide consent actions.

State which optional storage choices are available and link to the detailed policy. Offer distinct actions for consent choices without making one choice the only visible path.

```html
<aside aria-labelledby="cookie-title">
  <h2 id="cookie-title">Cookie choices</h2>
  <p>Choose whether to allow optional cookies.</p>
  <button type="button">Allow optional cookies</button>
  <button type="button">Reject optional cookies</button>
</aside>
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
