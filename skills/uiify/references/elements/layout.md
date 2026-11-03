# layout

Binding: layout

Express responsive page geometry with UIify layout components.

## Use when

A page needs explicit structure such as a sidebar and main region, a row of actions, or a responsive grid.

## Avoid when

Use ordinary document flow for simple reading order. This foundation does not expose named grid areas or arbitrary track strings.

## Structure

Compose `Box`, `Section`, `Stack`, `Grid`, and `GridItem` from `@gunkin/uiify`. Choose semantic tags with `as`; use `GridItem` to control placement inside a grid. Geometry props accept finite UIify token values.

## Responsive

Responsive values use `base`, `sm`, `md`, and `lg`. Explicitly change a sidebar grid to one column at the narrow condition; presets do not collapse automatically. `responsive="viewport"` uses viewport conditions, while the default uses an ancestor container.

## States

Layout components have no interactive state. Controls inside them retain native behavior, focus, and state.

## Verify

Check source order, narrow and embedded widths, long content, RTL, and zoom. Give each landmark an accessible name when multiple landmarks share its role. Confirm that an auto scroll region has a definite height and a clear owner.

## Common mistake

Do not assume a numeric grid or preset will infer page intent or reflow itself. Declare responsive changes and keep the DOM order meaningful.

Related laws: references/laws/proximity.md, references/laws/readability.md

## Sources

- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-11-03)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) (verified 2026-11-03)
