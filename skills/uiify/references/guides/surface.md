# What kind of page is this, and how expressive should it be?

Treat this classification as a heuristic about the requested page, not the product. Choose the surface that best describes the page being built; a product may contain several kinds.

Follow the request's scope: a reference sets a visual target, a narrow fix stays narrow, and a new page within an existing product follows that project's design decisions. Use surface guidance for the part being created or changed; an audit reports evidence without expanding into a redesign.

## Decide

For a landing, pricing, or campaign page, prioritize one clear next step per screen and make the evidence supporting its claim easy to find. Avoid competing primary actions and decorative imagery that does not support the message. Typical catalog choices include `hero`, `hero-actions`, `pricing-table`, `testimonial`, `feature-grid`, and `logo-wall`.

## Work

For settings, dashboards, admin tools, and tables, prioritize scanning, predictable controls, and information density. Avoid turning navigation or controls into decoration. Use typography, semantic color roles, density, and one distinctive detail for character. Typical choices include `header`, `sidebar`, `table`, `form`, `field`, `tabs`, `toolbar`, and `pagination`.

## Read

For documentation, articles, and changelogs, prioritize a readable line length, clear heading structure, and navigation within the page. Avoid narrow columns that make code or data unusable and headings that skip levels. Typical choices include `table-of-contents`, `code-block`, `accordion`, `breadcrumb`, and `pagination`.

## View

For galleries and portfolios, let the work lead and keep surrounding chrome quiet. Avoid controls or labels that compete with the work, while keeping meaningful descriptions and navigation available. Typical choices include `image-gallery`, `carousel`, `card`, `badge`, and `divider`.

## Review with evidence

At 320 CSS pixels wide, confirm that content and functionality reflow without two-dimensional scrolling except where the content genuinely requires it. This reflects [WCAG 2.2 Success Criterion 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html); it does not prescribe a visual style.

After inspecting a rendered page, change a detail only when you can name the visible problem, the state and viewport where it appears, and one correction. If you cannot point to all three, keep the design as it is.
