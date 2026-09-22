import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/surface.css"), "utf8").replace(
  /\s+/g,
  " ",
);

it("owns surface popover entry motion", () => {
  expect(css).toContain(
    "@media (prefers-reduced-motion: no-preference) { [data-uiify-surface][popover]:popover-open { animation: uiify-overlay-in var(--duration-fast) var(--ease-out); } }",
  );
});
