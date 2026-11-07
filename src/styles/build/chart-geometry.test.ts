import { resolve } from "node:path";
import { expect, it } from "vitest";
import { defineRecipe, defineStyle } from "../define.js";
import { compileStyle } from "./compile.js";

/** Per-point geometry is not expressible with Tailwind's generated utilities. */
export const geometryProbe = `@layer components.uiify {
  /* A slope-scaled segment needs hypot and atan2, which are not utilities. */
  .uiify-line-chart-point::before {
    --uiify-line-dx: calc(var(--uiify-line-run, 0) * 1cqw);
    --uiify-line-dy: calc(var(--uiify-line-rise, 0) / 100 * var(--uiify-line-point-block-size, 100cqh));
    inline-size: hypot(var(--uiify-line-dx), var(--uiify-line-dy));
    block-size: calc(var(--uiify-line-width) * 2);
    rotate: atan2(var(--uiify-line-dy), var(--uiify-line-dx));
  }
}`;

it("keeps per-point chart geometry in its own effects file and scoped output", async () => {
  const style = defineStyle("probe", [
    defineRecipe("line-chart", { base: "relative" }),
    defineRecipe("other", { base: "block" }),
  ]);
  const compiled = await compileStyle(style, {
    tailwindEntry: resolve(import.meta.dirname, "entry.css"),
    effectsCss: geometryProbe,
  });
  expect(compiled.perRecipe.get("line-chart")).toContain("hypot(");
  expect(compiled.perRecipe.get("line-chart")).toContain("atan2(");
  expect(compiled.perRecipe.get("other")).not.toContain("--uiify-line-dx");
  expect(compiled.scoped).toContain("[data-style=probe] .uiify-line-chart-point:before");
});

it("ships LineChart repeated-point geometry from the effects source", async () => {
  const { readFile } = await import("node:fs/promises");
  const effects = await readFile(resolve(import.meta.dirname, "../uiify/effects.css"), "utf8");
  expect(effects).toContain(".uiify-line-chart-point::before");
  expect(effects).toContain("hypot(var(--uiify-line-dx), var(--uiify-line-dy))");
  expect(effects).toContain("atan2(var(--uiify-line-dy), var(--uiify-line-dx))");
});
