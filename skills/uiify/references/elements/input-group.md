# input-group

Binding: input-group

Place text affixes or a related action beside a native input.

## Use when

Place a short prefix/suffix or a related native action beside an input.

## Avoid when

Do not use affix text as the only label or make passive text look clickable. Keep the input separate when the grouping harms reflow.

## Structure

`InputGroup` is a `div` layout wrapper. Compose the published `Input` for a matching field and `Button` for a related action; keep native children only when their needed behavior is not covered. Use `InputGroupAddon` for an add-on; its required `align` is `start` or `end` and appears as `data-align`. Keep a visible label associated with the input. If affix text gives instructions or a unit, include it in the input's `aria-describedby`.

## Responsive

Let the input shrink and long affix/action text wrap without clipping or hiding controls. Keep start/input/end in source order and use logical inline layout for RTL.

## States

Native input and action own their focus, disabled, and validation states. Keep server-invalid styling visible while the input is focused. Disabling an input does not disable a separate action. The group adds no click-to-focus behavior.

## Verify

With scripts disabled, check the label, affix, independently operable action, focus order, RTL, and long-copy reflow at narrow width and zoom. Browser proof is pending.

## Common mistake

Do not treat a protocol prefix or icon as a label. A displayed prefix is not part of the submitted value: a domain-only field with `https://` beside it uses `type="text"` and caller-owned URL assembly; `type="url"` expects the complete URL. Use unique field/description IDs for each example instance. Do not show an inert verification/copy button; use a real native form action or link.

## Sources

- [designsystem.digital.gov](https://designsystem.digital.gov/components/input-prefix-suffix/) (verified 2026-10-19)
- [ui.shadcn.com](https://ui.shadcn.com/docs/components/aria/input-group) (verified 2026-10-19)
- [www.w3.org](https://www.w3.org/WAI/tutorials/forms/labels/) (verified 2026-10-19)
