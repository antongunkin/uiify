# Turn the tree into components

Input: the validated tree, the brief and its slots. `dist/` and `agents/` paths are relative to the package root. Change no part, prop or text of the tree; if it is wrong, fix the tree and revalidate it.

Each node becomes the JSX element of its part, props become attributes and children stay children. Find a type's module and export in `dist/ai/loaders.generated.js` (`"NativeSelect"` → `components/native-select`, export `NativeSelect`); import it from `@gunkin/uiify/components/<name>`. A namespace export is not itself a JSX component; use its `.Root` or an explicit root export, and see `agents/reference/components/<name>.md` when an export or part wiring is unclear. Native nodes stay native elements. Layout nodes `Stack`, `Grid` and `Section` have no JSX export: write them as elements with the tree's `data-ui-layout`, `data-direction`, `data-gap`, `data-align`, `data-wrap`, `data-columns`, `data-padding` and `data-width` attributes, which `@gunkin/uiify/styles/layout.css` styles (also included by `@gunkin/uiify/styles`).

Then add what a tree cannot hold: fill each native `section` with the `slot-<name>` id, event handlers and state (a client component only where needed), real data, and the route files. The id is a handoff convention, not a runtime slot API. Keep the tree's ids and structure.

Check that the rendered page matches the tree: render both to a string and compare, ignoring only what the added handlers and data change. Then verify as `references/guides/verification.md` says and delete the scratch tree.
