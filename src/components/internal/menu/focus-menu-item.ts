/**
 * Move focus to the first (or last) enabled item of an open menu surface.
 *
 * One selector shared by DropdownMenu and ContextMenu. Before this, DropdownMenu
 * looked only at `[role="menuitem"]` (missing checkbox/radio items) and
 * ContextMenu looked at all three roles but focused disabled ones.
 */
const MENU_ITEM_SELECTOR =
  '[role="menuitem"]:not([aria-disabled="true"]),' +
  '[role="menuitemcheckbox"]:not([aria-disabled="true"]),' +
  '[role="menuitemradio"]:not([aria-disabled="true"])';

export function focusMenuItem(
  container: HTMLElement | null,
  options: { readonly last?: boolean } = {},
): void {
  if (!container) return;
  const items = container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR);
  const target = options.last ? items[items.length - 1] : items[0];
  target?.focus({ preventScroll: true });
}
