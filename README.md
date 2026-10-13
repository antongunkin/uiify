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

Documentation: https://uiify.gunkin.dev/

MIT © Anton Gunkin
