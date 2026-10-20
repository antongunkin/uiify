# item

Binding: item

Compose a list row with primary content, metadata, media, and a separate action.

## Use when

A real list needs a row with leading media, primary content, metadata, and a separate action.

## Avoid when

Do not use standalone `li` outside `ul`/`ol`. This is not a selectable list, menu, or whole-row click target.

## Structure

Put `Item` (`li` by default) inside `ul` or `ol`. Compose sibling `ItemMedia` (`span`), `ItemContent` (`div`), optional `ItemMetadata` (`div`), and `ItemActions` (`div`). Put primary navigation in an actual link and use the published `Button` for button actions. Choose meaningful image alt text or `alt=""` for decorative media.

## Responsive

Keep DOM order aligned with reading order. Allow title and metadata to wrap and keep actions visible at narrow widths and zoom; do not rely on truncation for essential text.

## States

There is no selection, hover-reveal, or list keyboard state. Child links/buttons own their native states and focus.

## Verify

Check list/list-item semantics, source and tab order, image alternatives, long/CJK text, RTL, and zoom reflow. Browser and assistive-technology proof is pending.

## Common mistake

Do not turn the whole row into a click handler or nest an action button inside a row link.

## Sources

- [ui.shadcn.com](https://ui.shadcn.com/docs/components/aria/item) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) (verified 2026-10-19)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) (verified 2026-10-19)
