# A request about a selected element

Visual editors send a request together with the element the person selected: its tag, DOM path and classes, sometimes styles or a screenshot. The `uiify-*` classes in the DOM are not in the source; find the screen, not the class.

## Find the code

The route renders a feature's `active.ts`, which picks a design in `designs/<name>.tsx`; texts and data are in `sample.tsx`. Match the selection by its text and its place in the design. Take names and props from the catalog in the uiify section of `AGENTS.md`, not from the package types.

## Scope

Decide what the request covers before editing:

- this element: "this button", "here", a selection with no "all";
- this design: every instance in the design file;
- every screen: "all buttons", "every card", the brand color; that is a theme token.

When the selection is one item of a repeated list (a card from `sample.tsx`), change that item only. When the scope is unclear, ask in one line first; never widen it silently.

## Layer

Take the first that does the job:

1. A prop or variant of the component: `size`, `variant`, `tone`, `gap`.
2. `slotProps` for a part of a component that has them.
3. `className` with theme classes on Tailwind's default scale.
4. The design file: reorder or add catalog parts.
5. A theme token in the project's CSS (`--primary` also fills the default `Button`; `--radius` sets the corners of every control and card) or a project component. Ask first: it changes every screen.

Never style `uiify-*` classes, edit `node_modules`, copy a UIify component into the project or set a raw color. To show another design, change only the import in `active.ts`, or open the preview route; leave the other designs alone.

## Examples

- "Make this button smaller" → `size="sm"` on that `Button`.
- "Bigger title" on a hero heading → `slotProps.title` with a larger `text-*` class.
- "Make it red, it deletes" → `variant="destructive"`, not a color.
- "Make all buttons rounder" → ask, then set `--radius` in the theme; not `rounded-full` on each button.
- "Our brand violet" on the header → ask, then set `--primary` in the theme; not `bg-violet-600`.

## After the edit

Run `node <skill>/scripts/check-screens.mjs <dir>` once, when the edits are done; it runs `tsc` too. Report in one line what changed and in which file.
