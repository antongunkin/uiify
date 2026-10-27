# breadcrumb

Binding: breadcrumb

Show the current page within a hierarchy of parent pages.

## Use when

Show where the current page sits in a hierarchy and provide links to parent pages.

## Avoid when

Do not use breadcrumbs as the only way to navigate or show unrelated destinations.

## Structure

Use BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, and BreadcrumbLink inside a labelled navigation landmark. Keep items in ancestor order, use current to identify the current page, and use links for ancestors.
When BreadcrumbList renders its data-driven `items`, use `slotProps.item` and `slotProps.link` for each generated item and link. Address a specific item with `byItemValue[item.key]`. Collapsed lists also accept `slotProps.ellipsisItem`, `ellipsis`, `ellipsisTrigger`, and `ellipsisContent`. The standalone `Breadcrumb.Ellipsis` uses `slotProps.item` and `slotProps.ellipsis`.

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
