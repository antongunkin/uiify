## UIify screens

These rules are for UIify screens only: feature folders importing `@gunkin/uiify`. Full rules: the uiify section of `AGENTS.md` and `{skill}/SKILL.md`.

- A screen is a feature folder: the page renders `active.ts`, which picks a design in `designs/<name>.tsx`; texts and data are in `sample.tsx`. Find the selected element by its text and its place in the design: several parts share one component, so change only the one that matches. A selection's `pagePath` (`SegmentViewNode`) names its route, not the element: start from that page. Without `uiify-*` or `data-ui-*` marks it is not a UIify screen.
- Take component names, props and variants (`Text tone`, `Button variant`, `Card size`) from the catalog in the uiify section of `AGENTS.md`, not from the package types or CSS in `node_modules`. A `className` on an instance wins over UIify's own styles, so do not read them.
- Change the least: a prop or variant (`size`, `variant`, `tone`, `gap`); then `slotProps` for a part of a component; then `className` with theme classes on Tailwind's scale. Another design is one import in `active.ts`. "All buttons", "every card" or a brand color mean every screen: ask, then change a theme token (`--primary` fills the default `Button`, `--radius`), not each instance.
- Never style `uiify-*` classes, edit `node_modules` or copy UIify components into the project.
- Read `{skill}/references/guides/visual-edits.md` only when a request needs more than these steps.
- When the edits are done, run `node {skill}/scripts/check-screens.mjs <dir>` once: it runs `tsc` too.
