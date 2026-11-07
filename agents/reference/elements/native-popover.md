<!-- Generated from the package source. Do not edit by hand. -->
# native-popover

- Import: `@gunkin/uiify/elements/native-popover`
- Native mechanism: [popover] + popovertarget
- Parts: `NativePopover.Trigger`, `NativePopover.Surface`, `NativePopover.Close`
- Used by: [popover](../components/popover.md)
- Types file: `dist/elements/native-popover.d.ts`

## Exports

- Runtime: `NativePopover`, `NativePopoverClose`, `NativePopoverSurface`, `NativePopoverTrigger`
- Types: `AnchorAlign`, `AnchorSide`, `NativePopoverCloseOwnProps`, `NativePopoverCloseProps`, `NativePopoverSurfaceMode`, `NativePopoverSurfaceOwnProps`, `NativePopoverSurfaceProps`, `NativePopoverTriggerAction`, `NativePopoverTriggerOwnProps`, `NativePopoverTriggerProps`

## Values

- `NativePopoverSurfaceMode`: `"auto" | "manual"` — Cross-engine baseline; `hint` is not part of this element's contract.
- `AnchorSide`: `"top" | "right" | "bottom" | "left"`
- `AnchorAlign`: `"start" | "center" | "end"`
- `NativePopoverTriggerAction`: `"toggle" | "show" | "hide"` — What a trigger does to its target popover when activated.

## Props and shapes

### NativePopoverTriggerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `action` | `NativePopoverTriggerAction` | no | Defaults to `"toggle"`. |
| `target` | `string` | yes | `id` of the `NativePopover.Surface` this button acts on. |

### NativePopoverCloseOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `target` | `string` | yes | `id` of the `NativePopover.Surface` this button hides. |

### NativePopoverSurfaceOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `align` | `AnchorAlign` | no |  |
| `children` | `ReactNode` | no |  |
| `id` | `string` | yes | Unique id supplied by the consumer; referenced by trigger and close `target`. |
| `mode` | `NativePopoverSurfaceMode` | no |  |
| `side` | `AnchorSide` | no |  |

## Other types

- `NativePopoverTriggerProps<TAs>`: `NativeButtonProps<TAs, NativePopoverTriggerOwnProps & NativePopoverInvokerNativeProps>`
- `NativePopoverCloseProps<TAs>`: `NativeButtonProps<TAs, NativePopoverCloseOwnProps & NativePopoverInvokerNativeProps>`
- `NativePopoverSurfaceProps`: `NativePopoverSurfaceOwnProps & Omit<ComponentPropsWithRef<"div">, keyof NativePopoverSurfaceOwnProps>` — Native props can override the surface defaults.
