# tabs

Binding: tabs

Switch between alternate views of the same object.

## Use when

Switch between equivalent views of the same object when only one view needs to be visible at a time.

## Avoid when

Use links for navigation, a stepper for sequential tasks, and side-by-side content when people need to compare views.

## Structure

UIify `Tabs` is compound: `<Tabs><TabsList><TabsTrigger name value defaultChecked>…</TabsTrigger>…</TabsList><TabsContent value>…</TabsContent>…</Tabs>`. Each `TabsTrigger` renders a native radio and its label; give every trigger of one `Tabs` the same literal `name` and a `value`, and set `defaultChecked` on one trigger (there is no root `defaultValue`). Contents pair with triggers by position, not by value: put `TabsTrigger` parts directly inside `TabsList`, put `TabsList` and every `TabsContent` directly inside `Tabs`, list the contents in trigger order, and use at most 12 tabs. `TabsContent value` repeats its trigger's value for readers and checks. `orientation` is `horizontal` or `vertical`. A trigger's native props, `className`, `style` and `ref` go to its label; `disabled` disables the radio. It does not implement the ARIA tablist pattern. Keep labels short and make each content match its label.

## Responsive

Let the trigger labels wrap as a group on narrow screens; do not shrink them until they are hard to read. Keep the selected label and its content visually connected.

## States

`defaultChecked` selects the initial trigger; with none checked the first content shows but no trigger looks selected. Changing the native radio changes the visible content with CSS only, without JavaScript. Use native radio keyboard behavior: arrow keys select the previous or next trigger; do not assume the APG tablist model.

## Verify

Check one trigger is selected, each label shows its matching content, contents are in trigger order, and Tab and arrow keys work as they do for a native radio group. Verify nested Tabs stay independent and the group works at narrow widths with long labels.

## Common mistake

Using tabs as the site's primary navigation hides the fact that each choice is a different page.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio) (verified 2026-10-17)
