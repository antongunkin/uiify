# command-palette

Binding: gap

Let users search for and invoke a small set of named commands.

## Use when

Provide a keyboard-accessible way to find and invoke named commands across an application.

## Avoid when

Do not call a static search form a command palette. Avoid menu/listbox semantics unless the complete keyboard and selection pattern is implemented.

## Structure

Give the search field a visible or programmatic label. A full palette must define how focus enters and leaves, how results are navigated and selected, and how the surface is dismissed; follow the applicable combobox and dialog pattern.

## Responsive

Keep the search field and results within the viewport, with a scrollable results region that does not trap page zoom.

## States

Provide clear no-results, loading, and execution feedback where applicable. Keep the query and focus behavior predictable when the palette closes.

## Verify

Test keyboard navigation, selection, Escape dismissal, focus restoration, screen-reader names, and narrow viewport behavior. A labeled search form alone does not pass this check.

## Common mistake

Adding arrow-key handlers to a list of buttons without implementing a coherent focus and selection model.

## Custom implementation

For a basic non-interactive list, use a labelled search form with ordinary links or buttons. Add command-palette behavior only with a complete, tested interaction model; UIify has no dedicated command-palette component.

## Sources

- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (verified 2026-10-17)
- [www.w3.org](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) (verified 2026-10-17)
