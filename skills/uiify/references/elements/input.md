# input

Binding: input

Accept a short, single-line value.

## Use when

Collect one short value such as a name, email address, or search query.

## Avoid when

Use a textarea for longer free text and a purpose-specific control when it provides a more suitable native input mode.

## Structure

Use the documented Input component with an associated visible label. Put format instructions before entry and connect them to the field; keep validation feedback beside the control.

## Responsive

Let the field and label reflow within the available width. Keep the label visible and avoid horizontal page scrolling.

## States

Preserve entered values when validation fails. Distinguish disabled, read-only, and invalid states, and explain the correction in text.

## Verify

Check the label association, input purpose and autocomplete where relevant, keyboard access, error description, and narrow-screen reflow.

## Common mistake

Using a placeholder as the only label or instruction.

Related laws: references/laws/proximity.md, references/laws/accessibility.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/instructions/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
