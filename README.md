# uiify

Native-first, accessible React 19 components that work before hydration.

> Alpha: APIs may change before the first stable release.

## Install

```bash
npm install @gunkin/uiify@alpha react react-dom
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

Documentation: https://uiify.gunkin.dev/

MIT © Anton Gunkin
