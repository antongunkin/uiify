# spinner

Binding: spinner

A task is actively pending and there is no reliable completion percentage

## Use when

A task is actively pending and there is no reliable completion percentage. Pair the indicator with a short label that says what is waiting.

## Avoid when

Do not show a spinner for a task with measurable progress; use a labeled progress element. Avoid showing it for work that completes too quickly to perceive.

## Structure

Use `Spinner` with a specific label. Its status role and polite live region announce the label; use showLabel when the text should also be visible.

## Responsive

Keep the indicator near the task it describes, reserve enough space to prevent layout jumps, and do not let fixed positioning obscure controls.

## States

The delay prop writes a delayed state marker; shipped CSS disables animation in that state, but does not hide the element or schedule a timer. The component supports sm/md/lg sizes and center/fixed/absolute alignment. Motion respects reduced-motion preferences in UIify styles.

## Verify

Check the announced label, visible label when needed, the delayed marker behavior, alignment at narrow widths, and reduced-motion rendering. Ensure completion removes the status.

## Common mistake

A spinner without a meaningful label says that something is happening but not what the person is waiting for. Do not treat `delay` as a timer that hides the indicator.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) (verified 2026-10-17)
