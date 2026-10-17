# inline-alert

Binding: gap

Give a short message context beside the content it affects.

## Use when

A message belongs beside the content or control it explains. Use status for a non-urgent update and alert only when the information requires immediate attention.

## Avoid when

Do not use assertive announcements for routine success, or a toast for an error that must remain visible while the person fixes it.

## Structure

This is an app-level composition, not a UIify component. Place concise text in a semantic status/alert element next to the affected content; include a heading when it helps identify the issue.

## Responsive

Keep the message in reading order beside the affected field or section. Let text wrap and do not communicate severity by color alone.

## States

Use role=status for dynamic, non-urgent updates; use role=alert for urgent messages that should be announced immediately. Keep the message visible until the related issue can be addressed.

## Verify

Check announcement timing and role, reading order, message visibility, color contrast, and the relationship to its field/section. Avoid repeating the same announcement through multiple live regions.

## Common mistake

Do not move focus to routine status text; the live region should announce the update while focus stays on the user's task.

## Custom implementation

```html
<p role="status">Changes saved.</p>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
