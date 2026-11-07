# accordion

Binding: accordion

Reveal optional sections without hiding content most visitors need.

## Use when

Use for FAQs or optional details when visitors need only a small subset. Keep content visible when most visitors need it; use `stepper` for sequential tasks.

## Avoid when

Do not hide the page's main explanation or an action that is the only way to continue inside a closed section.

## Structure

`Accordion` is compound: `<Accordion><AccordionItem value name defaultOpen><AccordionTrigger>…</AccordionTrigger><AccordionContent>…</AccordionContent></AccordionItem>…</Accordion>`. Each `AccordionItem` renders a native `<details>`, `AccordionTrigger` its `<summary>` and `AccordionContent` the revealed body. For single-open, give every item of one accordion the same literal `name` (the browser keeps one open); for multiple open items, leave `name` out. There is no root `type`, `collapsible` or `defaultValue`: open an item initially with `defaultOpen`. Each part accepts native props, `className`, `style`, refs and `data-*`; put Tailwind utilities on the part they style. When composing custom markup, use public `Details.Root`, `Details.Summary`, and `Details.Content` parts directly. The visible trigger is the question or section title; make it describe the revealed content.

## Responsive

Let long triggers wrap and preserve a clear open/closed cue. Keep triggers and their focus indicators visible at narrow widths.

## States

Items start closed unless marked `defaultOpen`. Native `<details>` supports keyboard activation; a shared `name` permits only one open section at a time. `AccordionTrigger disabled` sets `aria-disabled` and removes the trigger from the tab order so the item cannot be toggled. Search behavior for text inside closed sections can vary, so verify it in target browsers when page search matters.

## Verify

Use Tab to reach each summary, Enter or Space to toggle it, and confirm the focus indicator remains visible. Check long labels, single (shared `name`) and multiple modes, a disabled trigger, and whether browser find-in-page reveals matching closed content in supported target browsers.

## Common mistake

Hiding the only primary action in a section that starts closed makes the page's next step easy to miss.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) (verified 2026-10-17)
