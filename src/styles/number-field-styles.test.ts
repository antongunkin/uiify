import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { numberField } from "./uiify/number-field.js";
import { normalizeCss } from "./test-css.js";

const css = normalizeCss(
  readFileSync(resolve(import.meta.dirname, "../../dist/styles/uiify/number-field.css"), "utf8"),
);

describe("NumberField styles", () => {
  it("styles the documented Group wrapper and its public controls", () => {
    if (typeof numberField.base === "string") {
      throw new Error("NumberField base classes must be keyed by part");
    }
    expect(Object.keys(numberField.base)).toEqual(
      expect.arrayContaining(["group", "input", "decrement", "increment"]),
    );
    expect(numberField.base.group).toContain("inline-flex items-stretch");
    expect(numberField.base.input).toContain("w-16 min-h-9");
  });

  it("hides generated arrows from assistive technology and mirrors them in RTL", () => {
    expect(css).toContain(normalizeCss(".uiify-number-field-decrement:empty:before"));
    expect(css).toContain(normalizeCss(".uiify-number-field-increment:empty:before"));
    expect(css).toContain(normalizeCss(":dir(rtl)"));
  });
});
