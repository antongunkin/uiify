# Setup and upgrades

Read this when `sync-agents.mjs` reports a skill state other than `current` or `linked`, when the user asks how to install the skill, or after an upgrade.

## Install the skill

Link it in both places, so it follows the installed package without a refresh step:

```shell
mkdir -p .agents/skills .claude/skills
ln -s ../../node_modules/@gunkin/uiify/skills/uiify .agents/skills/uiify
ln -s ../../node_modules/@gunkin/uiify/skills/uiify .claude/skills/uiify
```

In a monorepo, link from the app's folder to the hoisted package (`../../../../node_modules/…` from `apps/web`) and run `sync-agents.mjs` there, so the app's `AGENTS.md` gets the section. Copy the directory only where links are impossible or the team wants it in git. Commands use `.agents/skills/uiify`; `sync-agents.mjs` checks and refreshes every copy in either place, one `skill` line each.

## Upgrade the package

Use `npm install @gunkin/uiify@latest`; `npm update` does not cross `0.0.x` alpha versions. Then run `sync-agents.mjs --write`, then `node .agents/skills/uiify/scripts/check-screens.mjs <dir>` and `tsc`; fix what they report. A name a release removed fails `tsc` on every screen that still uses it.

## React 19.3

`@gunkin/uiify` needs React 19.3 or later. `npm install` stops with `ERESOLVE` and `peer react@">=19.3.0"` in a project on React 19.2: run `npm install react@latest react-dom@latest` first.

## Project components

List the project's own components that screens may use in `package.json`: `"uiify": { "components": ["@/components/ui/chart", "@/components/ui/*"] }`. `sync-agents.mjs --write` lists them with their props in the `AGENTS.md` section (it warns above 3 KB and on a module that resolves to no file); `check-screens.mjs` allows them, except names that UIify has. A marked client module takes its client-only children (`recharts`) in a `"use client"` file.

## TypeScript 7

`check-screens.mjs` parses screens with the project's TypeScript. TypeScript 7 has no parser API in its main entry, so the check falls back to `@typescript/typescript6` (the official 6.0 API). When the check prints `has no parser API`, run `npm i -D @typescript/typescript6`; `tsc` keeps using TypeScript 7.

The project's `tsconfig` needs `strict` and `noUnusedParameters`: the screen check sees a slot that a design never takes, `tsc` sees one it takes but does not render.

## The skill line

- `skill: linked`: a link into the installed package; always current, never written to.
- `skill: current`: a copy that matches the installed version.
- `skill: outdated`: a copy whose `version.json` hash differs; `--write` refreshes it.

## TanStack Intent

`npx @tanstack/intent@latest list` finds this skill, but Intent only points at it. `sync-agents.mjs` writes the catalog section.
