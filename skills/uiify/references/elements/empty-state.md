# empty-state

Binding: empty

Explain an empty collection and offer a relevant next step.

## Use when

A collection has no items and the person needs a clear explanation and useful next step.

## Avoid when

Do not use the same message for loading, errors, access denial, or filtered no-results. Name the actual state.

## Structure

`Empty` renders a `section`; compose `EmptyTitle` (`h2`), `EmptyDescription` (`p`), and optional `EmptyContent` (`div`). Use a heading level that fits the page. For a button-styled destination, use the published `Button` with `as="a"` and `href`; use a plain link when link styling is intended. Keep all copy caller-owned. This is static content: it does not announce with `status` or `alert`.

## Responsive

Keep the explanation and action close in source order. Let long and translated copy wrap; do not constrain it to a narrow text column.

## States

Distinguish first-use empty from no matches, loading, and unavailable/error. A caller that updates results dynamically owns any announcement behavior.

## Verify

Check heading order, relevant action and destination, keyboard access, translated long-copy reflow, and static reading without JavaScript. Browser and assistive-technology proof is pending.

## Common mistake

Do not label static content as a live region or offer an unrelated create action for a filtered search.

## Sources

- [ui.shadcn.com](https://ui.shadcn.com/docs/components/base/empty) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role) (verified 2026-10-19)
