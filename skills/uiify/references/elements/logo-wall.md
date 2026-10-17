# logo-wall

Binding: gap

Show organizations associated with a product or event.

## Use when

A small collection of customer, partner, or member organizations provides relevant context.

## Avoid when

Do not present logos as proof of endorsement without permission, or include a large wall of brands that does not help the current decision.

## Structure

This is an app-level composition, not a UIify component. Use a list. Give each informative logo an alt text with the organization's name; use empty alt only when adjacent text already names it.

## Responsive

Preserve recognizable proportions and allow the list to wrap. Avoid raster logos that become blurry or require horizontal scrolling.

## States

If a logo links somewhere, give the link a meaningful accessible name and a real destination. If not interactive, do not make it look like a control.

## Verify

Check each image alternative, adjacent duplicate text, logo proportions, list reading order, link purpose, and mobile wrapping.

## Common mistake

An empty alt on an informative logo hides the organization name from screen readers.

## Custom implementation

```html
<ul aria-label="Organizations using the product">
  <li><img src="/logos/acme.svg" width="120" height="40" alt="Acme" /></li>
</ul>
```

This is an app-level composition; UIify does not currently ship this component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-16)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) (verified 2026-10-16)
