# stepper

Binding: gap

Show ordered steps and identify the current step in a multi-step task.

Present ordered steps in their actual sequence and identify the current step in text. Do not imply that future steps are completed.

```html
<ol aria-label="Application progress">
  <li>Account</li><li aria-current="step">Profile</li><li>Review</li>
</ol>
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [www.w3.org](https://www.w3.org/TR/wai-aria-1.2/#aria-current) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
