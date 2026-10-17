# sidebar

Binding: gap

Provide a secondary set of links for a site or application section.

Use a named navigation landmark with a list of destinations. Mark the current destination and keep the link order consistent across pages.

```html
<nav aria-label="Workspace">
  <ul><li><a href="/projects" aria-current="page">Projects</a></li></ul>
</nav>
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
