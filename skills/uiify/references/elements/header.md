# header

Binding: header

Orient visitors with stable top-level navigation.

## Use when

Orient people with site identity and primary navigation that stays in a consistent place and order across pages.

## Avoid when

Do not turn the header into a second page body or hide all navigation behind a menu on wide screens.

## Structure

`Header.Root` renders a semantic `<header>`. Place a home link for the site identity, a named `<nav>` with primary links, and at most one prominent action. Mark the current page link with `aria-current="page"`. Give repeated navigation landmarks distinct names when their link sets differ.

## Responsive

Keep the logo and one useful action visible on narrow screens. Move secondary navigation behind a clearly named button that opens a `Modal`; leave the full navigation visible on wide screens.

## States

Keep navigation order consistent between pages. The `Header` component itself is static; use `@gunkin/uiify/components/header/client` only when scroll hide/reveal is requested.

## Verify

Inspect the accessibility tree for the banner and named navigation landmarks. Tab through the logo, links, and action in reading order; on narrow screens open and close the menu with the keyboard and check its focus and accessible name.

## Common mistake

Hiding the entire navigation behind a hamburger on desktop makes common destinations harder to scan.

Related laws: references/laws/readability.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) (verified 2026-10-17)
