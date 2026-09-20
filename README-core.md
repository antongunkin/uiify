# `@gunkin/uiify/core`

Native-first, unstyled React 19 behavior primitives for `@gunkin/uiify/components`.

## Principles

- No `cloneElement`, `Slot`, `Slottable`, or `asChild`.
- No Floating UI or Popper runtime dependency.
- Native `<dialog>`, Popover API, top layer, WAAPI, and CSS anchor positioning
  are preferred over JavaScript recreations.
- Context locates stable stores; `useSyncExternalStore` publishes collection
  and roving-focus state.
- Every interactive area has a direct package subpath.

## Composition

```tsx
<VisuallyHidden>Additional context</VisuallyHidden>
<VisuallyHidden as="label" htmlFor="query">
  Search
</VisuallyHidden>

<RovingFocusItem
  render={(props, state) => (
    <RouterLink {...props} data-current={state.current} to="/settings" />
  )}
/>
```

The render callback receives merged props. Consumers must spread those props
onto the interactive element so refs, event handlers, and accessibility
attributes remain connected.

## Native overlays

`useDialog` controls a real `HTMLDialogElement`. `usePopover` controls an
element with the native `popover` attribute when available. Neither requires a
portal.

```tsx
const dialog = useDialog({ onOpenChange });

return (
  <>
    <button onClick={dialog.openDialog}>Open</button>
    <dialog {...dialog.dialogProps} ref={dialog.dialogRef}>
      <button onClick={() => dialog.close()}>Close</button>
    </dialog>
  </>
);
```

Use `FocusScope` and `DismissableLayer` only for custom surfaces whose semantics
cannot be represented by dialog or popover.

## Direct imports

```ts
import { useDialog } from "@gunkin/uiify/core/dialog";
import { composeEventHandlers } from "@gunkin/uiify/core/compose-event-handlers";
import { RovingFocusItem, RovingFocusRoot } from "@gunkin/uiify/core/roving-focus";
```

The root export is convenient, while direct imports provide explicit bundle
boundaries.
