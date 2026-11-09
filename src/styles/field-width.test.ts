import postcss from "postcss";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { compileStyle } from "./build/compile.js";
import { uiify } from "./uiify/index.js";

/**
 * M8 round 4: in a shadcn/Tailwind project a UIify Input sat at 24rem inside a card where shadcn's
 * Input fills the width. Under the adapter the field family fills its container like shadcn's
 * (`w-full`, no cap); UIify's own look keeps its 24rem field width.
 */
const roots = [
  ".uiify-field",
  ".uiify-input",
  ".uiify-textarea",
  ".uiify-input-group",
  ".uiify-form-error-summary",
  ".uiify-date-picker",
  ".uiify-color-picker-surface",
];

async function maxWidths(entry: string) {
  const compiled = await compileStyle(uiify, {
    tailwindEntry: resolve(import.meta.dirname, "build", entry),
    effectsCss: "",
  });
  const widths: Record<string, string[]> = {};
  postcss.parse(compiled.all).walkDecls("max-width", (declaration) => {
    const rule = declaration.parent as postcss.Rule;
    // Only the bare root rule: variants (`@md:max-w-none`, horizontal fields) are not the default.
    if (declaration.parent?.parent?.type !== "atrule" || !roots.includes(rule.selector)) return;
    (widths[rule.selector] ??= []).push(declaration.value);
  });
  return widths;
}

describe("field width", () => {
  it("fills its container under the Tailwind adapter, like shadcn's fields", async () => {
    const widths = await maxWidths("entry.css");
    for (const root of roots) expect(widths[root], root).toEqual(["none"]);
  });

  it("keeps UIify's own 24rem field width", async () => {
    const widths = await maxWidths("entry-own.css");
    for (const root of roots) expect(widths[root], root).toEqual(["calc(var(--spacing) * 96)"]);
  });
});
