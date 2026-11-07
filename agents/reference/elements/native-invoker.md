<!-- Generated from the package source. Do not edit by hand. -->
# native-invoker

- Import: `@gunkin/uiify/elements/native-invoker`
- Native mechanism: command/commandfor attributes
- Parts: `NativeInvoker`
- Used by: [dialog](../components/dialog.md)
- Types file: `dist/elements/native-invoker.d.ts`

## Exports

- Runtime: `NativeInvoker`
- Types: `NativeInvokerOwnProps`, `NativeInvokerProps`, `NativeCommand`

## Props and shapes

### NativeInvokerOwnProps

| Member | Type | Required | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | no |  |
| `command` | `NativeCommand` | yes | The command to invoke on `commandfor` when this button is activated. |
| `commandfor` | `string` | yes | `id` of the element this button invokes a command on. |

## Other types

- `NativeCommand`: `` "show-modal" | "request-close" | "close" | "show-popover" | "hide-popover" | "toggle-popover" | `--${string}` `` — The commands defined by the HTML NativeInvoker Commands API, plus a consumer `--*` custom command (template literal type). A custom command needs its own JS listener on `commandfor`'s target — this element documents that contract, it does not implement one.
- `NativeInvokerProps<TAs>`: `NativeButtonProps<TAs, NativeInvokerOwnProps>` — `as` defaults to `"button"`; intrinsic tags other than `"button"` are a type error — invoker commands only fire from a real button — and `type` is owned by the element (it is always `"button"`, never `"submit"`/`"reset"`).
