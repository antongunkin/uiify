# Optional static lint

Run `node <resolved-skill-directory>/scripts/lint.mjs <project-root>` when the project's existing checks do not cover the relevant JSX attributes. Resolve the script from this skill directory, not the project root.

It runs the static checks compiled from the published laws when this skill was built and prints their names. It does not read `DESIGN.md` or other design files.

It inspects literal attributes of lowercase intrinsic JSX tags and of parts imported from `@gunkin/uiify/components` or `@gunkin/uiify/elements` (for example `Button` or `Field.Control`). Other custom components and computed attribute values are not analyzed.

No findings is not proof of accessibility. Missing parsers or execution failures mean unavailable, never a pass. Reuse project build, typecheck and tests, browser interaction checks, and axe coverage for the requested page; this lint does not replace them.
