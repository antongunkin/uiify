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

The package also includes the `/uiify` AI skill. Invoke it explicitly when creating or improving a
web page with UIify. It adds component and UX knowledge to your request while preserving the agent's
normal workflow: no staged approvals, routine questions or special status output. It follows the
requested framework route and existing workspace conventions, reads version-matched component
references and supports custom UI for components UIify does not provide. Existing design decisions
are reused; invoking the skill does not require creating `DESIGN.md`.

The skill ships a compact index plus individually retrievable element, UX-law and composition
references under `skills/uiify/references/`. During planning it reads recipes for the requested
elements and relationships between them, then reads the public component docs for matched UIify
components. It does not load the whole catalog into the prompt. The private harness catalog is the
source for reviewed knowledge; the package contains only its curated public projection. Knowledge
is delivered as files, so this workflow does not require an MCP server.

Install the skill into the directory your agent reads:

```bash
# Cross-tool Agent Skills location (Codex, Copilot, Cursor, and compatible tools)
mkdir -p .agents/skills/uiify
cp -R node_modules/@gunkin/uiify/skills/uiify/. .agents/skills/uiify/

# For Claude Code, use this location instead
mkdir -p .claude/skills/uiify
cp -R node_modules/@gunkin/uiify/skills/uiify/. .claude/skills/uiify/
```

Claude Code uses `/uiify <page brief>`; other agents use their documented explicit skill invocation.
No special execution flag is needed. The repository's manual smoke harness exercises Claude Code
only; activation syntax and token measurements do not establish behavior for other clients.

For verification, the skill reuses project tooling. If missing Playwright or axe-core tooling or
browser binaries are needed, the agent briefly explains what it will install and why before
installation. This is a notice, not a routine confirmation question. Installation follows project
rules, uses development dependencies and includes only what is needed. Unavailable checks are
reported as not run.

### Keeping the skill current when developing UIify

When changing a UIify component, update its public component reference and example when its API or
usage changes, and update the harness catalog when its coverage or gap status changes. Then run
`npm run checks:fix` from the repository root. This regenerates the consumer AI docs and `/uiify`
skill, then checks their tests and freshness. Review and commit generated changes with the component
change. `npm run check:ai-harness` runs the focused tests and freshness checks without rewriting files.

For new design knowledge, inspect the component API and examples; record sourced evidence in the
private catalog; write a concise `release_body`; review the public projection for privacy and
usefulness; regenerate the skill; and run package-link and hygiene tests. Private evidence and owner
rationale stay in the harness source; changing private notes alone does not change what consumers
receive.

The optional paid eval runner records each agent and judge call separately. An unknown cost reserves
that call's configured cap and blocks later paid calls. `results.json` is atomically checkpointed
before and after calls and throughout page verification; an existing non-empty output directory is
not reused. This protects recorded progress but does not measure whether one skill produces better
designs than another.

Documentation: https://uiify.gunkin.dev/

MIT © Anton Gunkin
