<!-- Generated from the package source. Do not edit by hand. -->
# button

- Import: `@gunkin/uiify/components/button`
- Tier 0 (RSC — zero client JavaScript); state source none; native element `button`
- Without JavaScript: full
- Types file: `dist/components/button.d.ts`

## Related knowledge

- Recipe: [button](../../../skills/uiify/references/elements/button.md)

## Exports

- Runtime: `Button`
- Types: `ButtonElementProps`, `ButtonLinkProps`, `ButtonOwnProps`, `ButtonProps`, `ButtonSize`, `ButtonState`, `ButtonVariant`

## Values

- `ButtonVariant`: `"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"` — `default` is the filled foreground action, the same as leaving `variant` unset.
- `ButtonSize`: `"xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"` — `default` is the standard height, the same as leaving `size` unset.

## Props and shapes

### ButtonOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | no | Prevents activation and exposes the disabled state to assistive technology. |
| `selected` | `boolean` | no | Marks the button as the chosen one of a set, or a toggle that is on. |
| `type` | `"button" \| "submit" \| "reset"` | no | Sets the native button action; defaults to `button`. Set `submit` or `reset` explicitly when needed. |
| `size` | `ButtonSize` | no | Sets the control's height and, for icon sizes, its width. |
| `variant` | `ButtonVariant` | no | Sets the visual treatment without changing the control's semantics. |

### ButtonState

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | yes |  |
| `selected` | `boolean` | yes |  |

## Other types

- `ButtonLinkProps`: `` ButtonOwnProps & { /** A link has no native button action. */ readonly type?: never; /** Renders a link styled as a button. Without `as`, `href` selects the `a` element. */ readonly href: string; } & Omit<ComponentPropsWithRef<"a">, keyof ButtonOwnProps | "href" | "as" | "render"> `` — Link branch: `href` without `as` renders an `<a>` with the Button skin, equivalent to `as="a"`. Button-only props (`type`, `form*`) are not offered here.
- `ButtonElementProps<TAs>`: `RenderableProps<TAs, ButtonOwnProps, ButtonState, HTMLElement>` — Props of the polymorphic branch: a native button, `as`, or a render callback.
- `ButtonProps<TAs>`: `(ButtonElementProps<TAs> & (TAs extends "button" ? { readonly href?: never } : unknown)) | ButtonLinkProps`
