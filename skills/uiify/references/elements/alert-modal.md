# alert-modal

Binding: alert-modal

A short, important message requires an immediate response, especially confirmation before a consequential action

## Use when

A short, important message requires an immediate response, especially confirmation before a consequential action. Use a regular modal for a task or optional information, and inline validation for recoverable form errors.

## Avoid when

Do not use alert dialogs for routine notices or long, structured content. Do not make a destructive choice the default or leave consequences implicit.

## Structure

The convenience `AlertModal` provides a trigger, visible title, optional short description, Cancel, and Action. State the consequence in the description and make both choices explicit; the action uses the destructive variant.

## Responsive

Keep the message concise so it remains understandable in the modal at narrow widths and zoom. Allow the text to wrap; do not rely on color or icon alone to explain the consequence.

## States

Tier 0 uses a native modal [dialog role=alertdialog] opened by native invokers. Cancel and Action request close. Use the client entry only when application-controlled state is required.

## Verify

Check the accessible name and description, opening and closing by keyboard, focus containment and return, both explicit choices, and the narrow/zoomed layout. Confirm initial focus lands on Cancel, the safe choice: `AlertModal` renders Cancel before Action, so keep focusable content out of the dialog body above them.

## Common mistake

A red Delete button is not enough: name what will be deleted and what happens after each choice.
Example: `references/examples/alert-confirmation.md`.

Related laws: references/laws/error-prevention.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
