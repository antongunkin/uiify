# separator

Binding: separator

Separate adjacent sections or groups with a line, optionally labelled such as "or".

## Use when

Adjacent sections change topic and a thematic break helps people understand the transition, or two alternatives need an inline "or" between them.

## Avoid when

Do not add a separator between every repeated item or use it in place of spacing. Do not write the "or" divider as plain text or a bare `hr`.

## Structure

`Separator` renders a native `hr` with `data-orientation` (`horizontal` by default, or `vertical`, which also writes `aria-orientation="vertical"`). `FieldSeparator` renders a line with optional visible text: `<FieldSeparator>or</FieldSeparator>`. With text, both lines are decorative and the text is read as content; without text it is one separator. For a toolbar use `Toolbar.Separator`; menu separators stay in the menu components.

## Responsive

The lines are flexible and logical, so they follow writing direction. FieldSeparator text may wrap and stays centred. A vertical Separator takes its height from the flex row it sits in.

## States

Static. For a purely decorative line pass `role="presentation"`; a decorative vertical line also needs `aria-orientation={undefined}`.

## Verify

Check that the line marks a real change, the accessibility tree (one text node for the labelled divider, one `separator` otherwise), and the layout on the page background and inside a Card.

## Common mistake

Wrapping the divider text in a second `hr`, or giving the label its own background to hide the line behind it, which mismatches on Card, Dialog and Drawer surfaces.

## Sources

- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr) (verified 2026-11-06)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) (verified 2026-11-06)
