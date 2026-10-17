# password-input

Binding: gap

Collect a password while allowing password managers to help users enter it.

## Use when

Collect a current or new account password.

## Avoid when

Do not disable password managers or hide password requirements until after submission.

## Structure

Use a labelled native password input. Set autocomplete to current-password for sign-in or new-password when creating or changing a password. Present requirements before entry.

## Responsive

Keep the label, requirements, reveal control, and error text visible at narrow widths and zoom.

## States

If a show/hide control is provided, make it a keyboard-operable button with an action-specific accessible name and preserve the entered value when toggling. Keep errors next to the field.

## Verify

Test label association, password-manager autofill, keyboard operation of any reveal button, preservation of the value, and clear validation feedback.

## Common mistake

Setting autocomplete to off or clearing a valid password when another field fails.

## Custom implementation

Use a label and native input with type password; choose current-password or new-password to match the form. This app-level recipe does not add a UIify password-input component.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/password) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
