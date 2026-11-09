import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "@tailwindcss/node";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

/**
 * Control geometry (height, corner, font size, inline padding) and the default Button fill use
 * alias classes (`h-control-md`, `rounded-control`, `text-control`, `px-control-*`,
 * `bg-primary-fill`) that exist only at build time: the adapter maps them to shadcn/ui's "nova"
 * values on Tailwind's standard keys, UIify's own entry (`build/entry-own.css`) to its 40px pill.
 * Neither output defines a runtime variable a project could (wrongly) override (M8, D11).
 */
const styles = import.meta.dirname;
const read = (path: string) => readFileSync(resolve(styles, path), "utf8");
const dist = () => read("../../dist/styles/uiify.css");

/** Build-time alias keys and the runtime variables nothing may define any more. */
const aliasKeys = [
  "--spacing-control-xs",
  "--spacing-control-sm",
  "--spacing-control-md",
  "--spacing-control-lg",
  "--spacing-control-x",
  "--spacing-control-button",
  "--spacing-control-button-lg",
  "--radius-control",
  "--text-control",
  "--text-control-sm",
  "--text-control-lg",
  "--color-primary-fill",
  "--color-primary-fill-foreground",
  "--color-destructive-fill",
  "--color-destructive-fill-foreground",
];
const runtimeAlias =
  /--(?:control-[\w-]+|spacing-control[\w-]*|radius-control|text-control[\w-]*|color-(?:primary|destructive)-fill[\w-]*)\s*:/;

/** Recipes whose root is a control: their height, corner and font come from the aliases. */
const controlRecipes = [
  "button",
  "input",
  "native-select",
  "input-group",
  "segmented-control",
  "date-picker",
  "combobox",
  "input-otp",
];

/** Declarations of `@theme` blocks in `css`, by block params (`static`, `inline reference`, …). */
function themeBlocks(css: string) {
  const blocks: { params: string; values: Map<string, string> }[] = [];
  postcss.parse(css).walkAtRules("theme", (rule) => {
    const values = new Map<string, string>();
    rule.walkDecls((decl) => {
      values.set(decl.prop, decl.value.replace(/\s+/g, " "));
    });
    blocks.push({ params: rule.params.trim(), values });
  });
  return blocks;
}

/** The first `.uiify-button{…}` rule of a minified stylesheet. */
const buttonRule = (css: string) => /\.uiify-button\{([^}]*)\}/.exec(css)?.[1] ?? "";

describe("control geometry aliases", () => {
  it("the theme defines no runtime control tokens", () => {
    expect(read("themes/basic.css")).not.toMatch(/--control-[\w-]+\s*:/);
  });

  it("the adapter declares every alias once, as an inline reference key over standard keys", () => {
    const blocks = themeBlocks(read("tailwind.css"));
    const aliases = blocks.filter(({ params }) => params === "inline reference");
    expect(aliases).toHaveLength(1);
    const values = aliases[0]!.values;
    expect(aliasKeys.filter((name) => !values.has(name))).toEqual([]);
    const elsewhere = blocks
      .filter((block) => block !== aliases[0])
      .flatMap(({ values: other }) => aliasKeys.filter((name) => other.has(name)));
    expect(elsewhere).toEqual([]);
    const reads = [...values.values()].flatMap((value) =>
      [...value.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name!),
    );
    const nonStandard = reads.filter(
      (name) =>
        !/^--(?:spacing|radius-(?:sm|md|lg|xl)|text-(?:xs|sm|base|lg)|color-[\w-]+)$/.test(name) &&
        !["--destructive", "--destructive-foreground", "--foreground"].includes(name),
    );
    expect(nonStandard).toEqual([]);
  });

  it("the adapter output reads shadcn's nova geometry from standard variables", () => {
    const rule = buttonRule(dist());
    expect(rule).toContain("min-height:calc(var(--spacing) * 8)");
    expect(rule).toContain("border-radius:var(--radius-lg)");
    expect(rule).toContain("padding-inline:calc(var(--spacing) * 2.5)");
    expect(rule).toContain("font-size:var(--text-sm)");
    expect(dist()).not.toMatch(runtimeAlias);
    expect(dist()).not.toMatch(
      /var\(--(?:control-|spacing-control|radius-control|text-control|color-(?:primary|destructive)-fill)/,
    );
  });

  it("UIify's own entry keeps 40px pill controls", () => {
    const generated = read("generated/uiify.css");
    const rule = buttonRule(generated);
    expect(rule).toContain("min-height:calc(var(--spacing) * 10)");
    expect(rule).toContain("border-radius:var(--radius-full)");
    expect(rule).toContain("padding-inline:calc(var(--spacing) * 5)");
    expect(rule).toContain("font-size:var(--text-base)");
    expect(generated).not.toMatch(runtimeAlias);
    expect(read("generated/tailwind-theme.css")).not.toMatch(runtimeAlias);
  });

  it("a Tailwind host emits no alias variable, and copied alias classes still compile", async () => {
    const compiler = await compile(
      `@import "tailwindcss";\n@import "./tailwind.css";\n@import "../../dist/styles/uiify.css";`,
      { base: styles, onDependency() {} },
    );
    const css = compiler.build(["h-control-md", "rounded-control", "bg-primary-fill"]);
    expect(css).not.toMatch(runtimeAlias);
    expect(css).toMatch(/\.h-control-md \{\s*height: calc\(var\(--spacing\) \* 8\);/);
    expect(css).toMatch(/\.rounded-control \{\s*border-radius: var\(--radius-lg\);/);
  });

  it("control recipes read the aliases instead of fixed heights, pills and font sizes", () => {
    const height = /(?<![\w-])(?:min-)?(?:h|w|block)-(?:6|8|10|12)(?![\w-])/;
    const font = /(?<![\w-])text-(?:base|lg)(?![\w-])/;
    const offenders = controlRecipes.flatMap((name) =>
      [...read(`uiify/${name}.ts`).matchAll(/"([^"]*)"/g)].flatMap(([, classes = ""]) => {
        const found = [];
        if (height.test(classes)) found.push(classes.match(height)![0]);
        // Chips (Combobox tags) stay pills; a control's own corner is rounded-control.
        if (/(?<![\w-])rounded-full(?![\w-])/.test(classes) && !classes.includes("bg-secondary"))
          found.push("rounded-full");
        if (classes.includes("rounded-control") && font.test(classes))
          found.push(classes.match(font)![0]);
        return found.map((item) => `${name}: ${item}`);
      }),
    );
    expect(offenders).toEqual([]);
  });
});
