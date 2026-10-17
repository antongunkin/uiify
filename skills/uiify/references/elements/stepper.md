# stepper

Binding: gap

Show ordered steps and identify the current step in a multi-step task.

## Use when

Show the sequence and current position in a multi-step task.

## Avoid when

Do not use a stepper for unrelated navigation or suggest that future steps are already complete.

## Structure

Use an ordered list in task order. Identify the current step with aria-current="step" and provide concise step names.

## Responsive

Keep the current step and sequence understandable when labels wrap or the list becomes compact.

## States

Distinguish completed, current, and upcoming steps in text or semantics, not color alone. Update the current marker only when the task advances.

## Verify

Check list order, current-step announcement, keyboard sequence through any step links, and narrow-screen reading order.

## Common mistake

Marking every past step complete when users can still need to correct its information.

## Custom implementation

Render the sequence as an ol and set aria-current="step" on the current item. This task-progress pattern does not add a UIify component.

## Sources

- [www.w3.org](https://www.w3.org/TR/wai-aria-1.2/#aria-current) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) (verified 2026-10-17)
