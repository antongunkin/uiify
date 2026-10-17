# skeleton

Binding: skeleton

A known content layout is temporarily loading and a close shape preview can reduce the perception of a blank page

## Use when

A known content layout is temporarily loading and a close shape preview can reduce the perception of a blank page.

## Avoid when

Do not use skeletons for unknown layout, short waits, or as a substitute for an announced loading state. Do not present a false preview that suggests content is already available.

## Structure

Use `Skeleton` only around content that will occupy the same space. Match the approximate width, height, and shape; keep a separate status message when the loading state needs announcement.

## Responsive

Match the real content's responsive geometry and reserve its space so the page does not shift when it arrives.

## States

While loading, Skeleton is aria-hidden and does not render children. When loading becomes false, it renders the actual children. Pulse/shimmer/none variants are available; motion is reduced by shipped styles.

## Verify

Check loading and loaded transitions, no duplicate announcements, geometry at narrow widths, reduced motion, and that the final content replaces the placeholder.

## Common mistake

Do not expose placeholder blocks as meaningful content or rely on their movement to announce progress.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) (verified 2026-10-17)
