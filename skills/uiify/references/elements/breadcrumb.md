# breadcrumb

Binding: breadcrumb

Show the current page within a hierarchy of parent pages.

## Use when

Show where the current page sits in a hierarchy and provide links to parent pages.

## Avoid when

Do not use breadcrumbs as the only way to navigate or show unrelated destinations.

## Structure

Use Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink and BreadcrumbPage inside a labelled navigation landmark, as shadcn/ui does. Keep items in ancestor order: links for ancestors, `BreadcrumbPage` (a `span` with aria-current="page", not a link) for the current page. `BreadcrumbSeparator` is its own list item between two items, never inside one. Place `BreadcrumbEllipsis` (an aria-hidden "…") inside a `BreadcrumbItem`.
When BreadcrumbList renders its data-driven `items`, an item with `current: true` becomes a BreadcrumbPage and the `separator` prop is the content of the separator list items between items. Use `slotProps.item`, `slotProps.link`, `slotProps.page` and `slotProps.separator` for the generated parts; address a specific item with `byItemValue[item.key]`. Collapsed lists also accept `slotProps.ellipsisItem`, `ellipsis`, `ellipsisTrigger`, and `ellipsisContent`; each hidden link sits in its own list item.

## Responsive

Let long labels wrap or collapse middle ancestors with the documented items and maxItems props. Keep the current page visible.

## States

For a short trail, render each item. For a collapsed trail, make the omitted ancestors available through the documented native disclosure.

## Verify

Check that the navigation landmark has a name, ancestors are links, and the current page is announced as current. Test a long trail with keyboard and at a narrow viewport.

## Common mistake

Making the current page look like a link when it does not navigate.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
