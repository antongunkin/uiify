# drawer

Binding: drawer

A focused secondary task or navigation surface should enter from an edge and temporarily cover or accompany the page

## Use when

A focused secondary task or navigation surface should enter from an edge and temporarily cover or accompany the page. Choose it when the task benefits from a sheet-like spatial relationship.

## Avoid when

Do not use a drawer for content that should remain visible beside the page, or for a compact anchored choice list. Avoid turning primary navigation into a blocking task without a clear need.

## Structure

Use `Drawer` with a specific title, optional description, focused content, visible close control, and optional footer. Select side and size to fit the task; use snap points only when the client interaction is needed.

## Responsive

Use a bottom sheet on narrow screens when the task reads naturally as a sheet; keep its content scrollable and close action reachable. Respect safe areas and test the selected side at mobile widths.

## States

The native Tier 0 shell opens a dialog. Choose 'dismiss' deliberately: 'any' permits backdrop/Escape, 'closerequest' allows close requests, and 'none' requires an explicit close. The compound client API adds controlled state and optional snap-point dragging.

## Verify

Check visible title, focus entry/containment/return, close control, configured dismissal, scrolling, and narrow viewport. If using drag, test the handle with touch and pointer and ensure an explicit close remains available.

## Common mistake

Do not rely on dragging as the only way to close or resize the drawer.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (verified 2026-10-17)
- [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) (verified 2026-10-17)
