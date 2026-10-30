import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string): string => readFileSync(resolve(import.meta.dirname, path), "utf8");

/** The declaration block of the first rule whose selector list contains `selector`. */
function ruleBody(css: string, selector: string): string {
  const start = css.indexOf(selector);
  expect(start, `rule "${selector}" exists`).toBeGreaterThanOrEqual(0);
  const openBrace = css.indexOf("{", start);
  return css.slice(openBrace, css.indexOf("}", openBrace));
}

// iOS Safari zooms the page when a text-entry control below 16px takes focus.
const textEntryControls = [
  ["components/field.css", ":where([data-uiify-input], [data-uiify-textarea])"],
  ["components/number-field.css", '[data-uiify-number-field] > [role="spinbutton"]'],
  ["components/tags-input.css", '[data-uiify-tags-input] [data-part="input"]'],
] as const;

// Pill controls are sized like Button: the base text step, which is already 16px.
const pillControls = [
  ["components/select.css", "[data-uiify-select]"],
  ["components/combobox.css", '[data-uiify-combobox] [data-part="input"]'],
] as const;

describe("touch text-entry controls", () => {
  it.each(pillControls)(
    "%s sizes %s from the control font, defaulting to the base text step",
    (file, selector) => {
      expect(ruleBody(read(file), selector)).toMatch(
        /font-size: var\(--uiify-control-font, var\(--text-base\)\);/,
      );
    },
  );

  it.each(textEntryControls)("%s sizes %s from the control text token", (file, selector) => {
    expect(ruleBody(read(file), selector)).toMatch(/font-size: var\(--uiify-control-text\);/);
  });

  it("defaults the control text token to the small text step", () => {
    expect(ruleBody(read("base.css"), ":root")).toContain("--uiify-control-text: var(--text-sm);");
  });

  it("raises the control text token to the base step on coarse pointers", () => {
    const base = read("base.css");
    const media = base.match(/@media \(pointer: coarse\) \{(?<body>[\s\S]*?)\n {2}\}\n/);

    expect(media?.groups?.body).toContain("--uiify-control-text: var(--text-base);");
  });

  it("keeps the base text step at 1rem, the iOS zoom threshold at the default root size", () => {
    expect(read("tokens/theme.css")).toContain("--text-base: 1rem;");
  });
});
