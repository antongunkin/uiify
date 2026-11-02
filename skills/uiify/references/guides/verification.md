# Verify a UI document

Run in this order, with the project's own tooling, after the document and its route are written. Fix findings, then rerun from the failing step.

1. **`tsc`** (the project's typecheck script): `satisfies UiNodeInput` reports an unknown part, prop or value at the offending node. Run it before the other checks, which assume a typed document.
2. **`validateDocument`**: call it from `@gunkin/uiify/ai` on the document object, in a test or one-off script the project can run (for example vitest or `tsx`). It must return `ok: true`; otherwise each issue has a breadcrumb such as `form › Field.Root › Button.props.variant` and the allowed values. It also enforces rules `tsc` cannot: a part sits inside its root, a `fieldId` names the enclosing root's `id`, ids are unique, nesting stays as the HTML parser keeps it (no block or component inside `p`, headings, `a` or `label`; no form inside a form; only items in lists), and depth, node count and string length stay within limits. It does not check `htmlFor`: a dangling `htmlFor` or a missing label is caught by html-validate and axe-core.
3. **html-validate** on the rendered HTML: render the route or document to a string (for example `renderToReadableStream` from `react-dom/server`, inside `Suspense`), place it in a page with `lang`, `title` and `main`, and run html-validate with the project's configuration.
4. **axe-core** on the same HTML, in jsdom or a Playwright page. Disable `color-contrast` in jsdom, which has no layout; check contrast in a real browser.

A passing run proves valid markup and no detectable axe violations, not good design: review the page with the design guides, and test keyboard use and responsive layout in a browser. Report any check you could not run, and why.

## Optional static lint

Run `node <resolved-skill-directory>/scripts/lint.mjs <project-root>` when the project's existing checks do not cover the relevant JSX attributes. Resolve the script from this skill directory, not the project root.

It runs the static checks compiled from the published laws when this skill was built and prints their names. It does not read `DESIGN.md` or other design files.

It does not analyze UI documents, which are object literals; it inspects literal attributes of lowercase intrinsic JSX tags and of parts imported from `@gunkin/uiify/components` or `@gunkin/uiify/elements` (for example `Button` or `Field.Control`). Other custom components and computed attribute values are not analyzed.

No findings is not proof of accessibility. Missing parsers or execution failures mean unavailable, never a pass. Reuse project build, typecheck and tests, browser interaction checks, and axe coverage for the requested page; this lint does not replace them.
