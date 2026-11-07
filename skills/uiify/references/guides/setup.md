# Setup and upgrades

Read this when `sync-agents.mjs` reports a skill state other than `current` or `linked`, when the user asks how to install the skill, or after an upgrade.

## Install the skill

Link it in both places, so it follows the installed package without a refresh step:

```shell
mkdir -p .agents/skills .claude/skills
ln -s ../../node_modules/@gunkin/uiify/skills/uiify .agents/skills/uiify
ln -s ../../node_modules/@gunkin/uiify/skills/uiify .claude/skills/uiify
```

In a monorepo, point the links at the resolved package path. Copy the directory to both places only where links are not possible or the team wants the skill in git. Commands keep using `.agents/skills/uiify`; `sync-agents.mjs` checks and refreshes every copy it finds in either place and prints one `skill` line per directory.

## Upgrade the package

Use `npm install @gunkin/uiify@latest`; `npm update` does not cross `0.0.x` alpha versions. Then run `sync-agents.mjs --write`, then `node .agents/skills/uiify/scripts/check-screens.mjs <dir>` and `tsc`; fix what they report. A name a release removed is no longer exported, so `tsc` fails on every screen that still uses it.

## The skill line

- `skill: linked`: a link into the installed package; always current, never written to.
- `skill: current`: a copy that matches the installed version.
- `skill: outdated`: a copy whose `version.json` hash differs; `--write` refreshes it.

## TanStack Intent

`npx @tanstack/intent@latest list` finds this skill, but Intent only points at it. The catalog section is written by `sync-agents.mjs`, not by Intent.
