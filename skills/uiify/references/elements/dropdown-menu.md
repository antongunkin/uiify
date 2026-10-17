# dropdown-menu

Binding: dropdown-menu

A button reveals a compact set of actions or settings for that button

## Use when

A button reveals a compact set of actions or settings for that button. Use menu items for commands, checkbox items for independent toggles, and radio items for one choice within a group.

## Avoid when

Do not use a menu for site navigation; use ordinary links and navigation landmarks. Do not use menu roles for a form or a list of links that should remain in the page's normal Tab sequence.

## Structure

Compose `DropdownMenu` Root, Trigger, Content, and named items. Give the trigger an action-oriented accessible name; group related actions with labels and separators, and use checkbox/radio items only for their matching state model.

## Responsive

Keep the menu within the viewport and ensure labels remain readable at zoom. Provide a touch-sized trigger and avoid making hover the only way to open it.

## States

The trigger opens the menu; keyboard interaction moves focus among items and Escape closes and returns focus. Selection closes by default. 'openOnHover' is optional enhancement; preserve the normal click and keyboard route.

## Verify

Test trigger by keyboard and pointer, arrow-key item navigation, Home/End where supported, Escape and focus return, disabled items, selection, and checked/radio state announcements. Check placement near viewport edges.

## Common mistake

A row of destination links is navigation, even if it visually resembles a dropdown menu.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) (verified 2026-10-17)
