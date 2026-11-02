# Write the page as a UI tree

`dist/` and `agents/` paths are relative to the package root.

1. Read only `agents/reference/ai/<component-folder>.md` for each selected component (use the existing component folder from the Index), plus `native.md` or `layout.md` in that directory when needed. They list all usable parts, required and optional props, allowed values, bounds, descriptions and enclosing roots. Use nothing they lack; do not load the full declaration catalog. Read the relevant small example in `references/guides/document-examples.md` before composing.
2. Write the page as a UI tree with `satisfies UiNodeInput`: nodes are `{ type, props, children }`; children are nodes or strings. Values and `.map` over data are plain TypeScript; annotate callbacks `(row): UiNodeInput => …`. Import types from `@gunkin/uiify/ai`. For components, keep the tree in a temporary `.ts` file included by the project's typecheck; delete it after JSX conversion.
3. Run `tsc` and `validateDocument` on it (`references/guides/verification.md`) and fix the tree before anything else is written.
4. Document form only: render it with `<Suspense><UiDocument node={page} /></Suspense>`, and validate a stored document with `validateDocument` before saving it.

Label a control with a native `{ type: "label", props: { htmlFor } }` node and the control's `id`. No component part takes `as`; `Field.Label` labels only `Field.Control` (a `div`); inputs and selects need a native label. Interactivity is native only: `href`, form `method`/`action`, invoker `commandfor`/`command` (for example `ModalTrigger`); `popoverTarget` is not available on parts.

Not available to a tree yet: Tier 2 components and the parts, with reasons, in `uiUnavailableParts` in `dist/ai/catalog.generated.d.ts` (Tabs, charts, Toast, Breadcrumb.Ellipsis…). Where one belongs, put a native `section` with `id="slot-<name>"` and list the slots in the handoff. This id is a handoff convention, not a document node type or runtime slot API. In the components form the second pass fills each from `@gunkin/uiify/components/<name>` (see `agents/components.md`); in the document form write that piece as ordinary JSX outside the document, and say so.

Use a part, not a raw-tag lookalike of `Button`, `Input`, `Checkbox` or `AlertModal`. Keep native elements when no part fits or the page demonstrates native semantics; keep `fieldset`, `dl` and forms.
