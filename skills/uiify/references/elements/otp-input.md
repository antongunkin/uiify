# otp-input

Binding: otp-input

Collect a one-time verification code as one value.

## Use when

Collect a short one-time code as one verification value.

## Avoid when

Do not split a code into independently labelled fields that require users to move between separate controls. Do not rely on SMS codes as the only factor for account security.

## Structure

Use OtpInput.Root, one OtpInput.Slot per position, and OtpInput.HiddenInput. UIify HiddenInput exposes the accessible name “One-time code” and uses autocomplete one-time-code. Keep visible instructions beside the slots that explain where the code comes from.

## Responsive

Keep every slot visible and large enough to inspect at narrow widths and zoom. Do not force horizontal page scrolling.

## States

Distinguish incomplete, complete, disabled, and invalid submission feedback. Keep the single code value available for paste and autofill.

## Verify

Test typing, paste, one-time-code autofill, keyboard navigation, accessible naming, invalid attempts, and the complete value reaching the form.

## Common mistake

Making each visual digit a separate text field that interrupts autofill and paste.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/OTP) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
