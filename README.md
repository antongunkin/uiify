# uiify

Native-first, accessible React 19 components that work before hydration.

> Alpha: APIs may change before the first stable release.

## Install

```bash
npm install @gunkin/uiify react react-dom
```

## Use

```tsx
import { Button } from "@gunkin/uiify/components/button";
import "@gunkin/uiify/components/behavior.css";

export function SaveButton() {
  return <Button>Save</Button>;
}
```

`behavior.css` contains required state behavior but no visual theme. Optional styles:

```css
@import "@gunkin/uiify/styles/reset";
@import "@gunkin/uiify/styles/tokens";
@import "@gunkin/uiify/styles";
```

Use focused `@gunkin/uiify/components/*`, `@gunkin/uiify/elements/*`, `@gunkin/uiify/core/*`, or `@gunkin/uiify/hooks` imports in
Server Components so client boundaries remain explicit.

## AI coding agents

`@gunkin/uiify` ships rules, a component index and per-component references that match the
installed version. Add one line to your project's `AGENTS.md`, or to `CLAUDE.md` for Claude Code
(it does not read `AGENTS.md`):

```text
For @gunkin/uiify, read node_modules/@gunkin/uiify/agents/index.md
```

In a monorepo with hoisted dependencies, point to the nearest `node_modules/@gunkin/uiify`.

### `/uiify` page-building skill

The package also includes the `/uiify` AI skill. Use it when an agent is creating or improving a
web page with UIify: it maps the brief to available components, plans the page in `DESIGN.md`,
implements the page in `src/App.tsx` when that file exists, and reports the checks it could run.
It uses the installed package's component references and follows UIify's public styling and
accessibility contracts. Invoke it explicitly so it runs only for page-building work.

Install the skill into the directory your agent reads:

```bash
# Cross-tool Agent Skills location (Codex, Copilot, Cursor, and compatible tools)
mkdir -p .agents/skills/uiify
cp -R node_modules/@gunkin/uiify/skills/uiify/. .agents/skills/uiify/

# For Claude Code, use this location instead
mkdir -p .claude/skills/uiify
cp -R node_modules/@gunkin/uiify/skills/uiify/. .claude/skills/uiify/
```

Then invoke `/uiify <page brief>` in Claude Code, or use the explicit skill invocation supported by
your agent. Add `--auto` to run all stages without confirmation gates. Interactive runs pause at
each stage so you can stop before implementation. The skill writes its design state to `DESIGN.md`
and page code under `src/`; it does not create a page when `src/App.tsx` is absent.

### Keeping the skill current when developing UIify

When changing a UIify component, update its public component reference and example when its API or
usage changes, and update the harness catalog when its coverage or gap status changes. Then run
`npm run checks:fix` from the repository root. This regenerates the consumer AI docs and `/uiify`
skill, then checks their tests and freshness. Review and commit generated changes with the component
change. `npm run check:ai-harness` runs the focused tests and freshness checks without rewriting files.

Documentation: https://uiify.gunkin.dev/

MIT © Anton Gunkin
