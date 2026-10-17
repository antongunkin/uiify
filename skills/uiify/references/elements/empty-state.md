# empty-state

Binding: gap

Explain why a collection has no items and offer a relevant next step.

## Use when

A collection has no items and the person needs to understand what is empty and what useful step is available next.

## Avoid when

Do not show an empty state for loading, filtered no-results, access denial, and a genuinely new collection as though they were the same cause. Name the actual state.

## Structure

This is an app-level composition, not a UIify component. Give the section a heading that names the collection and one relevant next step; use a link for navigation or a button for an in-place action.

## Responsive

Keep the message and action close in reading order, use a concise line length, and do not center long explanatory copy in an unnecessarily narrow area.

## States

Distinguish first-use empty, filtered no-results, unavailable/error, and loading states. Explain a recovery action for filters and avoid suggesting creation when the person lacks permission.

## Verify

Check the heading and action name, real destination/behavior, keyboard access, state-specific copy, and narrow/zoom layout.

## Common mistake

“No results” should offer a way to clear or change filters, not a create action unrelated to the search.

## Custom implementation

```html
<section aria-labelledby="empty-title">
  <h2 id="empty-title">No invoices yet</h2>
  <p>Create an invoice to see it listed here.</p>
  <a href="/invoices/new">Create invoice</a>
</section>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
