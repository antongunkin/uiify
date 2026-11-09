## UIify screens

These are the UIify screen rules in short; the full rules are the uiify section of `AGENTS.md` and `{skill}/SKILL.md`.

- A screen is a feature folder: the page renders `active.ts`, which picks a design in `designs/<name>.tsx`; texts and data are in `sample.tsx`. Look for code there: the `uiify-*` classes in the DOM are not in the source. Find the selected element by its text and its place in the design: several parts share one component and class, so change only the one that matches.
- Take component names, props and variants (`Text tone`, `Button variant`, `Card size`) from the catalog in the uiify section of `AGENTS.md`, not from the package types or CSS in `node_modules`. A `className` on an instance wins over UIify's own styles, so there is no need to read them.
- Change the least: a prop or variant; then `slotProps` for a part of a block; then `className` with theme classes on Tailwind's scale; a theme token (`--primary` fills the default `Button`, `--radius`) or a project component only after asking.
- Never style `uiify-*` classes, edit `node_modules` or copy UIify components into the project.
- For a request about a selected element, read `{skill}/references/guides/visual-edits.md` first.
- After every change run `node {skill}/scripts/check-screens.mjs <dir>` and `tsc`.
