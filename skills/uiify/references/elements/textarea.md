# textarea

Binding: textarea

Accept a longer free-text value.

## Use when

Collect a response that may span multiple lines, such as a message or description.

## Avoid when

Use a single-line input for short values and avoid imposing a character limit that the task does not require.

## Structure

Associate the documented Textarea with a visible label. State length or format limits before entry and place validation feedback next to the control.

## Responsive

Let the field grow to the available inline size and allow entered text to wrap. Use the documented autoSize option when content-driven height is appropriate.

## States

Preserve text after an error and identify invalid content in text; do not rely on a color change alone.

## Verify

Check the visible label, instructions, keyboard editing, error association, long content, and narrow-width reflow.

## Common mistake

Using placeholder text as a substitute for the label or hiding the only copy of a length limit.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/instructions/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
