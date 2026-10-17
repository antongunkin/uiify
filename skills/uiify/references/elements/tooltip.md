# tooltip

Binding: tooltip

Add a brief supplemental label to a control without replacing its name.

## Use when

Add a short, supplemental explanation to an icon-only control or unfamiliar action. Keep the control's accessible name on the trigger; tooltip text does not replace it.

## Avoid when

Do not put essential instructions or interactive content in a tooltip. Keep field labels visible; use `popup` or `hover-card` for content that needs interaction.

## Structure

Nest `Tooltip.Root`, `Tooltip.Trigger`, and `Tooltip.Content` inside `Tooltip.Provider`. Content is a non-focusable tooltip associated with its trigger. For touch users, make the same information available without hover.

## Responsive

Keep tooltip text brief and ensure it remains within the viewport. Touch has no hover, so essential information must remain available through visible text or another deliberate interaction.

## States

UIify opens on mouse hover after the provider delay and immediately on keyboard focus; Escape closes it. Focus stays on the trigger. The WAI-ARIA APG tooltip pattern is still work in progress, so treat it as guidance rather than a settled standard.

## Verify

Focus the trigger with the keyboard and confirm the tooltip appears and is referenced by the trigger. Confirm Escape dismisses it, pointer movement between trigger and content does not close it prematurely, and the content is not clipped at viewport edges. Check the equivalent touch interaction.

## Common mistake

Using a tooltip as the only label for a field leaves the field unnamed when the tooltip is unavailable.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) (verified 2026-10-17)
