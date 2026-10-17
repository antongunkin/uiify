# context-menu

Binding: context-menu

A specific object has a short set of actions that are useful at the point where the user invokes its context menu

## Use when

A specific object has a short set of actions that are useful at the point where the user invokes its context menu. Every action must also be available through a discoverable visible control or another accessible route.

## Avoid when

Do not make right-click the only way to reach an action, or use this for general navigation. On touch devices, users need a visible alternative.

## Structure

Wrap the object with `ContextMenu` Root, Trigger, Content, and concise action items. Use checkbox/radio items only for state choices and provide clear labels that make sense without pointer coordinates.

## Responsive

Context menus are supplementary on touch: expose the same actions through a visible button or menu. Check that pointer-anchored placement stays on screen.

## States

The trigger opens on the context-menu event and the menu focuses an item. Arrow keys move through items, Enter/Space selects, and Escape closes and returns focus.

## Verify

Test context-menu key/pointer opening, keyboard navigation and selection, Escape/focus return, outside dismissal, disabled items, and viewport-edge placement. Verify the same actions are reachable without a right-click.

## Common mistake

Do not hide the only route to an important action behind a context menu.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) (verified 2026-10-17)
