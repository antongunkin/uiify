# modal

Binding: modal

Hold attention on a task that must be completed before returning to the page.

## Use when

The person must finish or dismiss a focused task before returning to the page. Use inline content when they need to compare it with the page; use `toast` for brief feedback and `alert-modal` for an irreversible decision.

## Avoid when

Do not open a modal automatically on page load or use one for content most visitors need to read.

## Structure

`Modal` provides a trigger, named dialog, title, optional description and body, close control, and optional footer. Give it a specific title, concise body, and clearly labeled actions. A modal dialog contains its Tab sequence; include a visible way to close it.

## Responsive

On narrow screens the default modal becomes a full-width bottom sheet. Its body scrolls while the header and footer remain visible. Keep the task short enough to understand and complete in this space.

## States

The native `show-modal` dialog blocks interaction with the page. Default dismissal allows Escape. `dismiss="none"` uses native `closedby`; Safari ignores it and still permits Escape. Verify supported engines. Controlled or initially open state requires `ModalClientContent` from `@gunkin/uiify/components/modal/client`.

## Verify

Open from the keyboard. Confirm focus enters the dialog, stays within its Tab sequence, Escape closes it when dismissal is enabled, focus returns to the trigger, and the dialog has its visible title as its accessible name. Check long content and footer actions at a narrow viewport.

## Common mistake

A generic title such as “Notice” does not explain the task. Name the decision or activity instead.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) (verified 2026-10-17)
