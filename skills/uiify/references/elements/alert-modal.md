# alert-modal

Binding: alert-modal

A short, important message requires an immediate response, especially confirmation before a consequential action

## Use when

Confirm a consequential action. Use a regular modal for a task or optional information, inline validation for recoverable form errors.

## Avoid when

Do not use alert dialogs for routine notices or long, structured content. Do not make a destructive choice the default or leave consequences implicit.

## Structure

The convenience `AlertModal` provides a trigger, visible title, optional short description, Cancel, and Action. State the consequence in the description and make both choices explicit; the action uses the destructive variant. When composing parts, give the title and description unique IDs and put matching `aria-labelledby` and `aria-describedby` on `AlertModalContent`; the parts do not infer them.

## Responsive

Keep the message concise and wrapping at narrow widths and zoom. Explain consequences in text.

## States

Tier 0 uses a native [dialog role=alertdialog] opened by invokers. Cancel and Action request close; the convenience shell does not perform an application action. For mutations, compose `AlertModalTrigger`, `AlertModalContent`, `AlertModalCancel`, `AlertModalAction` from `@gunkin/uiify/components/alert-modal`: Content's `id` matches each button's `target`. Connect Action's native `onClick` to the effect in your application's client boundary. There is no `alert-modal/client` entry. `onClose` alone does not mean confirmation: Cancel and Escape also close. Keep those paths free of mutations.

## Verify

Check name/description, keyboard opening/closing, containment, return and narrow/zoomed layout. Confirm initial focus lands on Cancel, the safe choice: `AlertModal` renders Cancel before Action, so keep focusable content out of the dialog body above them. Cancel/Escape retain native opener focus. Only when confirmation removes that opener, focus the next/previous row or an empty-state heading with `tabIndex={-1}`. An unconditional `onClose` focus override also runs after Cancel/Escape and breaks their return.

## Common mistake

A red Delete button is not enough: name what will be deleted and what happens after each choice.
Example: `references/examples/alert-confirmation.md`.

Related laws: references/laws/error-prevention.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
