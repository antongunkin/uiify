# form-error-summary

Binding: form-error-summary

List form errors with links to the affected fields.

## Use when

A server-rendered form response needs a summary of errors and navigation to affected fields.

## Avoid when

Do not expect this static component to validate fields, announce dynamic updates, move focus, or repair missing IDs.

## Structure

`FormErrorSummary` takes required `title: ReactNode` and `errors: readonly { href: string; message: ReactNode }[]`. It renders a `section`, heading, and list of links. Name the section with native `aria-label` when useful. Each `href` must target a unique field ID in the same form instance. Use the published `Input` or `Field.Control` for matching fields, and associate matching inline error text with the control using caller-owned `aria-describedby`. An empty error array renders `null`.

Use `slotProps.title` and `slotProps.list` for the heading and list. Use
`slotProps.item` and `slotProps.link` for each error row and link. Repeated
slots accept common native props or `byItemValue` keyed by each error's
unique `href`; the component keeps the field link target and anatomy markers.

## Responsive

Keep error links readable and allow long messages to wrap. Preserve the document order between the summary and form.

## States

The component is static and has no `role="alert"`, live region, focus movement, or validation engine. Use dynamic announcements only in caller-owned behavior when the application updates errors.

## Verify

Check every link target, matching field and inline description, empty rendering, keyboard fragment navigation, and long-copy reflow. Browser and assistive-technology behavior is pending verification.

## Common mistake

Do not repeat field IDs when mounting multiple examples: prefix every input, label, description and error link consistently. Do not render dead fragment links, replace inline errors with the summary, promise automatic focus, or mark initial static content as an urgent alert.

## Sources

- [design-system.service.gov.uk](https://design-system.service.gov.uk/components/error-summary/) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/notifications/) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role) (verified 2026-10-19)
