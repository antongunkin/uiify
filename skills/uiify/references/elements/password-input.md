# password-input

Binding: gap

Collect a secret string while the browser masks entered characters.

Use a visible label, the appropriate autocomplete value, and nearby password requirements. Keep entered values when showing validation errors.

```html
<label for="account-password">Password</label>
<input id="account-password" name="password" type="password" autocomplete="current-password" />
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
