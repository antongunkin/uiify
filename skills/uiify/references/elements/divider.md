# divider

Binding: gap

Separate adjacent thematic sections when a heading is not appropriate.

## Use when

Adjacent sections change topic and a thematic break helps people understand the transition.

## Avoid when

Do not add a divider between every repeated item or use it in place of spacing. Decorative lines that convey no grouping should remain outside the accessibility tree.

## Structure

This is an app-level composition, not a UIify component. Use the native hr element for a thematic break; use CSS border for a purely decorative rule.

## Responsive

Use logical sizing and preserve separation as content wraps or stacks. Avoid rules that become ambiguous in vertical writing or dense layouts.

## States

A thematic break is static. If a separator labels a widget such as a menu, use that widget's separator semantics instead of hr.

## Verify

Check whether the line marks a real topic change, reading flow around it, and narrow layout.

## Common mistake

A visual border between every card is not automatically a thematic break.

## Custom implementation

```html
<hr />
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
