import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { uiify } from "./uiify/index.js";

const stylesRoot = import.meta.dirname;
const read = (path: string) => readFileSync(resolve(stylesRoot, path), "utf8");

describe("committed generated styles", () => {
  it("match a fresh compile of the uiify style for UIify's own entry (run npm run build -w @gunkin/uiify)", async () => {
    const compiled = await compileStyle(uiify, {
      tailwindEntry: resolve(stylesRoot, "build/entry-own.css"),
      effectsCss: read("uiify/effects.css"),
    });
    expect(compiled.perRecipe.get("field")).toContain('@import "./input.css";');
    expect(compiled.perRecipe.get("field")).toContain('@import "./textarea.css";');
    expect(read("generated/uiify.css")).toBe(compiled.all);
    expect(read("generated/tailwind-theme.css")).toBe(compiled.theme);
  });
});
