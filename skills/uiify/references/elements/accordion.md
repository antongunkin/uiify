# accordion

Binding: accordion

Reveal optional sections without hiding content most visitors need.

## Use when

Use for FAQs or optional details when visitors need only a small subset. Keep content visible when most visitors need it; use `stepper` for sequential tasks.

## Avoid when

Do not hide the page's main explanation or an action that is the only way to continue inside a closed section.

## Structure

`Accordion` takes an `id`, `items` with a `value`, `label`, and `panel`, and `type="single"` or `"multiple"`. The visible summary is the question or section title; make it describe the revealed content. Single mode uses native `<details name>` grouping, so opening one section closes the other.

## Responsive

Let long summaries wrap and preserve a clear open/closed cue. Keep summaries and their focus indicators visible at narrow widths.

## States

Items start closed unless selected by `defaultValue`. Native `<details>` supports keyboard activation; its `name` group permits only one open section at a time. Search behavior for text inside closed sections can vary, so verify it in target browsers when page search matters.

## Verify

Use Tab to reach each summary, Enter or Space to toggle it, and confirm the focus indicator remains visible. Check long labels, single and multiple modes, and whether browser find-in-page reveals matching closed content in supported target browsers.

## Common mistake

Hiding the only primary action in a section that starts closed makes the page's next step easy to miss.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) (verified 2026-10-17)
