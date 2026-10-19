# pagination

Binding: pagination

Navigate between pages of a result set.

## Use when

Let people move through a result set split into discrete pages.

Set `locale` to format page numbers, and translate the `labels.page` template using its `{page}` placeholder.

## Avoid when

Do not paginate a small result set that is easier to scan as one list, or imply that ellipses are links.

## Structure

Use Pagination.Root with a specific navigation label and the documented count. Provide descriptive names for previous/next controls, expose the current page with selected, and use getPageHref when pages are navigable URLs.

## Responsive

Keep the current page and adjacent navigation available; reduce distant page links before shrinking targets or labels.

## States

Disable controls at the ends of the range and preserve the current page when results update. If the result set changes, announce the updated result context.

## Verify

Check the navigation name, current-page semantics, end states, keyboard focus order, and that each URL or action reaches the stated page.

## Common mistake

Showing a selected page only by color or leaving a previous/next control active at a boundary.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) (verified 2026-10-17)
