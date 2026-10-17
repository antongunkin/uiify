# footer

Binding: gap

Offer secondary navigation and supporting information at the end of a page.

## Use when

Collect site-wide destinations, contact details, and supporting information after the main content.

## Avoid when

Do not use the footer to repeat every page section or create a landmark for a small local card footer.

## Structure

Use a page-level footer landmark and group related destinations into labelled navigation lists. Keep repeated link order consistent across pages.

## Responsive

Allow link groups to wrap or stack while preserving their source order. Avoid clipped columns and tiny tap targets.

## States

Keep destinations available at every viewport; do not hide essential links behind hover-only behavior.

## Verify

Check the landmark structure, labels for multiple navigation regions, keyboard access, and reflow at narrow widths and zoom.

## Common mistake

Using a page-level footer inside a card and unintentionally creating a landmark.

## Custom implementation

Use a semantic footer with headings and navigation lists. This app-level pattern does not add a UIify component.

Related laws: references/laws/readability.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
