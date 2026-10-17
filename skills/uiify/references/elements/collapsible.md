# collapsible

Binding: collapsible

Reveal secondary content with a native details/summary disclosure.

## Use when

A section is secondary to the main flow and people benefit from choosing when to reveal it.

## Avoid when

Do not hide information people need to complete the primary task or expect users to open several sections to compare content. Use headings and visible content for essential information.

## Structure

Use `Collapsible` with a specific visible label and content. It uses native details/summary; give the root a stable id. Keep the disclosure label concise and informative.

## Responsive

Let revealed content reflow naturally and avoid fixed-height panels. Keep the summary hit area comfortably operable on touch.

## States

The native details element supports open/closed state without JavaScript. Enter/Space toggles the summary. 'defaultOpen' sets initial state; 'disabled' removes the summary from focus and marks it aria-disabled.

## Verify

Test keyboard and pointer toggle, open/closed announcement, initial open state, disabled state, multiple independent disclosures, and narrow content reflow.

## Common mistake

Do not use the disclosure label as a vague “More” when it can name the hidden content.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) (verified 2026-10-17)
