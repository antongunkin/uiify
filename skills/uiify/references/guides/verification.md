# Verify the page

Run in this order with the project's tooling. Fix findings, then rerun from the failing step. Steps 1 and 2 check the tree, before any component is written; the components form adds the project's build and tests, and the static lint at the end.

1. **`tsc`**: `satisfies UiNodeInput` checks part names, props and values. Confirm the temporary `.ts` tree appears in `tsc --listFilesOnly -p <project-config>`. If excluded, typecheck with a temporary tsconfig extending the project config and naming the tree in `files`. Check the tree before continuing.
2. **`validateDocument`**: call it from `@gunkin/uiify/ai` on the document object, in a test or one-off script (vitest, `tsx`). It must return `ok: true`; otherwise each issue has a breadcrumb such as `form › Field.Root › Button.props.variant` and the allowed values. It enforces the selected reference's numeric bounds, enclosing roots, `fieldId` wiring, unique ids, list/table anatomy, nested-button restrictions, and depth/node/string limits. It does not check `htmlFor`: a dangling `htmlFor` or a missing label is caught by html-validate and axe-core.
3. **html-validate** on the rendered HTML: render the route (or the document) to a string (for example `renderToReadableStream` from `react-dom/server`, inside `Suspense`), place it in a page with `lang`, `title` and `main`, and run html-validate with the project's configuration.
4. **axe-core** on the same HTML, in jsdom or a Playwright page. Disable `color-contrast` in jsdom, which has no layout; check contrast in a real browser.

A passing run proves valid markup and no detectable axe violations, not good design: review the page with the design guides, and test keyboard use and responsive layout in a browser. Report any check you could not run.

## Optional static lint

Run `node <resolved-skill-directory>/scripts/lint.mjs <project-root>` when the project's existing checks do not cover the relevant JSX attributes. Resolve the script from this skill directory, not the project root.

It runs the static checks compiled from the published laws when this skill was built and prints their names. It does not read `DESIGN.md` or other design files.

It does not analyze UI documents, which are object literals; it inspects literal attributes of lowercase intrinsic JSX tags and of parts imported from `@gunkin/uiify/components` or `@gunkin/uiify/elements` (for example `Button` or `Field.Control`). Other custom components and computed attribute values are not analyzed.

No findings is not proof of accessibility. Missing parsers or execution failures mean unavailable, never a pass. It does not replace the project's own checks.
