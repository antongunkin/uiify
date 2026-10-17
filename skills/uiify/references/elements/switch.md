# switch

Binding: switch

Expose a binary setting that takes effect immediately.

## Use when

Let a person turn a persistent setting on or off and apply the change immediately.

## Avoid when

Use a checkbox for a form choice that is applied on submit, or a button for a one-time action.

## Structure

Use the documented Switch with a stable visible label that describes the setting. Keep the label unchanged as the state changes, and expose the current checked state.

## Responsive

Keep the label and control together as they wrap. Ensure the complete control remains operable at narrow widths.

## States

Make on, off, and disabled states clear. If changing the setting triggers remote work, communicate pending and failure feedback in text.

## Verify

Test label activation, Space-key operation, checked-state announcement, persistence after navigation, and feedback for failed updates.

## Common mistake

Using a switch for a form value that does not take effect until the user submits.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-17)
