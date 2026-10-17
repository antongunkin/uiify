# tabs

Binding: tabs

Switch between alternate views of the same object.

## Use when

Switch between equivalent views of the same object when only one view needs to be visible at a time.

## Avoid when

Use links for navigation, a stepper for sequential tasks, and side-by-side content when people need to compare views.

## Structure

UIify `Tabs` takes an `id`, `items` with a `value`, `label`, and `panel`, and an optional `defaultValue` and `orientation`. It renders a native radio group with one label and panel per item; it does not implement the ARIA tablist pattern. Set `defaultValue` so a useful panel is selected initially. Keep labels short and make each panel's content match its label.

## Responsive

Let the radio labels wrap or scroll as a group on narrow screens; do not shrink them until they are hard to read. Keep the selected label and its panel visually connected.

## States

`defaultValue` selects the initial radio and panel; changing the native radio changes the visible panel. The panels are CSS-only and work without JavaScript. Use native radio keyboard behavior; do not assume the APG tablist arrow-key model.

## Verify

Check one radio is selected, each label selects its matching panel, and Tab and arrow keys work as they do for a native radio group. Verify the group at narrow widths and with long labels.

## Common mistake

Using tabs as the site's primary navigation hides the fact that each choice is a different page.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) (verified 2026-10-17)
