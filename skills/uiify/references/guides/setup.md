# Setup and upgrades

Read this when `sync-agents.mjs` reports a skill state other than `current`, when the user asks how to install the skill, or after an upgrade.

## Install the skill

From the app's folder (in a monorepo too: the package may be hoisted to the root):

```shell
npx @gunkin/uiify init
```

It copies the skill into `.agents/skills/uiify` and `.claude/skills/uiify` and writes the `AGENTS.md` section. Commit both copies. Commands use `.agents/skills/uiify`; `sync-agents.mjs` checks and refreshes every copy in either place, one `skill` line each.

## Upgrade the package

Use `npm install @gunkin/uiify@latest`; `npm update` does not cross `0.0.x` alpha versions. Then run `npx @gunkin/uiify init`, then `node .agents/skills/uiify/scripts/check-screens.mjs <dir>`, which runs `tsc` too; fix what it reports. A name a release removed fails `tsc` on every screen that still uses it.

## React 19.3

`@gunkin/uiify` needs React 19.3 or later. `npm install` stops with `ERESOLVE` and `peer react@">=19.3.0"` in a project on React 19.2: run `npm install react@latest react-dom@latest` first.

## Project components

List the project's own components that screens may use in `package.json`: `"uiify": { "components": ["@/components/ui/chart", "@/components/ui/*"] }`. `sync-agents.mjs --write` lists them with their props in the `AGENTS.md` section (it warns above 3 KB and on a module that resolves to no file); `check-screens.mjs` allows them, except names that UIify has. A marked client module takes its client-only children (`recharts`) in a `"use client"` file.

## TypeScript 7

`check-screens.mjs` parses screens with the project's TypeScript. TypeScript 7 has no parser API in its main entry, so the check falls back to `@typescript/typescript6` (the official 6.0 API). When the check prints `has no parser API`, run `npm i -D @typescript/typescript6`; `tsc` keeps using TypeScript 7.

The project's `tsconfig` needs `strict` and `noUnusedParameters`: the screen check sees a slot that a design never takes, `tsc` sees one it takes but does not render.

## The skill line

- `skill: current`: a copy that matches the installed version.
- `skill: outdated`: a copy whose `version.json` hash differs, or a link left by an old install; `--write` replaces it with a copy.
- `skill: added`: `init` copied the skill where there was none.

## TanStack Intent

`npx @tanstack/intent@latest list` finds this skill, but Intent only points at it. `sync-agents.mjs` writes the catalog section.
