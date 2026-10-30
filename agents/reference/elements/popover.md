<!-- Generated from the package source. Do not edit by hand. -->
# popover

- Import: `@gunkin/uiify/elements/popover`
- Native mechanism: [popover] + popovertarget
- Parts: `Popover.Trigger`, `Popover.Surface`, `Popover.Close`
- Used by: [popup](../components/popup.md)
- Types file: `dist/elements/popover.d.ts`

## Exports

- Runtime: `Popover`, `PopoverClose`, `PopoverSurface`, `PopoverTrigger`
- Types: `AnchorAlign`, `AnchorSide`, `PopoverCloseOwnProps`, `PopoverCloseProps`, `PopoverSurfaceMode`, `PopoverSurfaceOwnProps`, `PopoverSurfaceProps`, `PopoverTriggerAction`, `PopoverTriggerOwnProps`, `PopoverTriggerProps`

## Values

- `PopoverSurfaceMode`: `"auto" | "manual"` — Cross-engine baseline; `hint` is not part of this element's contract.
- `AnchorSide`: `"top" | "right" | "bottom" | "left"`
- `AnchorAlign`: `"start" | "center" | "end"`
- `PopoverTriggerAction`: `"toggle" | "show" | "hide"` — What a trigger does to its target popover when activated.

## Props and shapes

### PopoverTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `action` | `PopoverTriggerAction` | no | Defaults to `"toggle"`. |
| `target` | `string` | yes | `id` of the `Popover.Surface` this button acts on. |

### PopoverCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `Popover.Surface` this button hides. |

### PopoverSurfaceOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |
| `mode` | `PopoverSurfaceMode` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `PopoverTriggerProps<TAs>`: `NativeButtonProps<TAs, PopoverTriggerOwnProps & PopoverInvokerNativeProps>`
- `PopoverCloseProps<TAs>`: `NativeButtonProps<TAs, PopoverCloseOwnProps & PopoverInvokerNativeProps>`
- `PopoverSurfaceProps`: `PopoverSurfaceOwnProps & Omit<ComponentPropsWithRef<"div">, keyof PopoverSurfaceOwnProps>` — Native props can override the surface defaults.
