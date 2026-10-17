# hover-card

Binding: hover-card

A link or control has useful supplementary detail that a person may inspect on hover or keyboard focus without leaving the current page

## Use when

A link or control has useful supplementary detail that a person may inspect on hover or keyboard focus without leaving the current page. Keep it optional and short.

## Avoid when

Do not place essential instructions, required actions, or the only copy of important information in a hover card. Do not use it for a brief label (tooltip) or a menu of actions.

## Structure

Compose `HoverCard` Root, Trigger, and Content. Give the trigger a meaningful name on its own; the card supplements it rather than repairing an ambiguous link label.

## Responsive

The card opens on mouse hover and keyboard focus. Touch users need the same essential information elsewhere in the page and a usable trigger. Keep content narrow enough to fit without obscuring nearby controls.

## States

Focus or mouse hover opens the card; pointer movement into the content keeps it open, and leaving schedules close. Configure open/close delays only when they improve pointer travel without making content feel unresponsive.

## Verify

Test keyboard focus, mouse travel from trigger to card, dismissibility, persistence while moving the pointer, narrow viewports, and that all essential content remains available without hover.

## Common mistake

A hover card that closes while the pointer travels from its trigger to its content fails the hover/focus content requirements.

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
