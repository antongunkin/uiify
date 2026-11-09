# pricing-table

Binding: gap

Let visitors compare plan features and choose a plan.

## Use when

Help people compare two to four plans and choose one. Show the same categories in the same order so meaningful differences are easy to find.

## Avoid when

Do not present plans as cards if the contents cannot be compared, or use color alone to identify a recommended option.

## Structure

For each plan, show its name, price and billing period, who it suits, key feature differences, and one action. Give each action a name that identifies its plan, such as “Choose Pro.” Mark a recommended plan with visible text as well as any styling. Use a `Grid` of `Card`s, one per plan (price, period, features, action, recommended); for a plan choice inside a form, use `RadioGroupItem`s with a `FieldLabel` and `FieldDescription` in a `RadioGroup`.

## Responsive

Stack plans on narrow screens in the same reading order. Keep plan names, prices, differences, and actions together; allow long names and feature descriptions to wrap.

## States

If people can switch billing periods, use a `SegmentedControl` and update both each price and its period label. Check long plan names and feature lists without clipping.

## Verify

Compare all plans at desktop and narrow widths. Confirm that each price has a period, each action's accessible name identifies its plan, and any recommended plan is identified in text.

## Common mistake

Giving every plan an identical “Get started” action makes it unclear which option the action will select.

## Custom implementation

This is an app-level composition; UIify does not ship a pricing table component. Compose it from a labeled `Section`, a `Grid` and one `Card` per plan.

Related laws: references/laws/proximity.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) (verified 2026-10-17)
