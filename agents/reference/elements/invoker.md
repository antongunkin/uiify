<!-- Generated from the package source. Do not edit by hand. -->
# invoker

- Import: `@gunkin/uiify/elements/invoker`
- Native mechanism: command/commandfor attributes
- Parts: `Invoker`
- Used by: [dialog](../elements/dialog.md)
- Types file: `dist/elements/invoker.d.ts`

## Exports

- Runtime: `Invoker`
- Types: `InvokerOwnProps`, `InvokerProps`, `NativeCommand`

## Props and shapes

### InvokerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `command` | `NativeCommand` | yes | The command to invoke on `commandfor` when this button is activated. |
| `commandfor` | `string` | yes | `id` of the element this button invokes a command on. |

## Other types

- `NativeCommand`: `` "show-modal" | "request-close" | "close" | "show-popover" | "hide-popover" | "toggle-popover" | `--${string}` `` — The commands defined by the HTML Invoker Commands API, plus a consumer `--*` custom command (template literal type). A custom command needs its own JS listener on `commandfor`'s target — this element documents that contract, it does not implement one.
- `InvokerProps<TAs>`: `NativeButtonProps<TAs, InvokerOwnProps>` — `as` defaults to `"button"`; intrinsic tags other than `"button"` are a type error — invoker commands only fire from a real button — and `type` is owned by the element (it is always `"button"`, never `"submit"`/`"reset"`).
