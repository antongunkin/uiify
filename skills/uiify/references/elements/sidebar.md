# sidebar

Binding: gap

Provide secondary navigation for a site or application section.

## Use when

Provide a stable set of destinations within a larger site or application section.

## Avoid when

Do not use a sidebar for a short set of links that fits naturally in the page header or content.

## Structure

Use a nav landmark with a concise accessible name and a list of links. Group links under headings only when the groups help people find destinations. Mark the current destination with aria-current="page".

## Responsive

At narrow widths, place navigation in the document flow or expose it through a clearly named disclosure control. Keep DOM and keyboard order aligned with the page.

## States

Show the current location in text or semantics, and preserve it when the navigation collapses or expands.

## Verify

Check the landmark name when the page has multiple navigation regions, the current link state, keyboard access, and narrow-screen reflow.

## Common mistake

Using a second navigation landmark with the same name for a different set of destinations.

## Custom implementation

Use a named nav containing grouped lists of ordinary links. This app-level pattern does not add a UIify component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
