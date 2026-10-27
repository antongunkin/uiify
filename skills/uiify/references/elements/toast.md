# toast

Binding: toast

Confirm the result of a completed save.

## Use when

A brief, non-blocking update confirms a completed action or reports a change while the person continues working. Use assertive priority only when the message is urgent.

## Avoid when

Do not use a timed toast for errors that require correction, critical information, or a decision. Put actionable errors in the relevant form or page and keep them visible.

## Structure

Place a live `ToastViewport` beside the client provider and enqueue a concise title/description. Include an explicit close control; add one short action only when undo or a direct follow-up is useful.
Style generated queue nodes with `Toast.Viewport`'s `slotProps` (`item`, `title`, `description`, `action`, `close`). Repeated slots accept `byItemValue`, keyed by the toast record id. Configure the provider's generated polite and assertive announcement elements with `Toast.Provider`'s `slotProps` (`politeLiveRegion`, `assertiveLiveRegion`).

## Responsive

Keep notifications clear of controls and safe areas, allow text to wrap, and limit simultaneous messages so the queue stays readable.

## States

Toasts default to polite announcements and a 4-second duration. Hover and focus pause the timer; set duration to 0 for persistent feedback. The client island is required for the queue; the exported shell alone does not enqueue messages.

## Verify

Check that a save message is announced without moving focus, pause on pointer/focus, close control, queue behavior, persistent duration, and a narrow viewport. Confirm assertive announcements are reserved for urgent messages.

## Common mistake

Do not auto-dismiss an error before the person can read and act on it.

Related laws: references/laws/feedback.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) (verified 2026-10-16)
