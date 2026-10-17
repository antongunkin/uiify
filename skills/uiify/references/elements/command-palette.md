# command-palette

Binding: gap

Let users find and invoke a small set of named commands.

For a non-interactive command list, use a labeled search form and links or buttons with clear names. A searchable list is not a command palette until keyboard navigation, selection, and dismissal behavior are implemented.

```html
<form role="search">
  <label for="commands">Search commands</label>
  <input id="commands" type="search" />
  <ul><li><a href="/settings">Open settings</a></li></ul>
</form>
```

This is an app-level composition recipe; it does not add a component to UIify.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
