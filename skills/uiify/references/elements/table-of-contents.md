# table-of-contents

Binding: table-of-contents

Help readers navigate sections within a long page.

## Use when

Help readers jump among named sections in a long document or article.

## Avoid when

Do not add a contents rail to a short page or include headings that are not present in the content.

## Structure

Use the documented TableOfContents parts with a named navigation region and links whose fragments match stable heading IDs. Reflect heading hierarchy with the documented level.

## Responsive

Keep the links reachable on small screens. The native popover trigger can expose the contents without removing the in-page heading and fragment destinations.

## States

Use the base entry for native fragment navigation. The /client entry can add scroll tracking and controlled open/current state; it enhances the native shell after hydration.

## Verify

Follow each link and confirm its target exists, is visible after navigation, and is not obscured by a sticky header. Check the named landmark and keyboard operation of the popover trigger.

## Common mistake

Using scroll position alone to highlight a link while its fragment target is missing or unstable.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) (verified 2026-10-17)
