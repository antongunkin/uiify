import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { __unstable__loadDesignSystem, compile, optimize } from "@tailwindcss/node";
import postcss, { type ChildNode, type Container } from "postcss";
import type { Style } from "../define.js";
import { recipeToApplyCss } from "./apply-css.js";
import { recipeClassLists } from "./parts.js";
import { validateRecipeSyntax } from "./validate.js";

export interface CompiledStyle {
  /** The whole style in one file. */
  readonly all: string;
  /** One file per recipe; each `@import`s the recipes it `requires`. */
  readonly perRecipe: ReadonlyMap<string, string>;
  /** The whole style under `[data-style="<style>"]`, for previewing several styles on one page. */
  readonly scoped: string;
  /**
   * The theme values the adapter declares (`@layer theme { :root { … } }`), for hosts that load the
   * compiled style without running Tailwind with `@gunkin/uiify/tailwind.css`.
   */
  readonly theme: string;
}

export interface CompileStyleOptions {
  /** Tailwind entry CSS (theme, adapter, custom variants) that recipe classes compile against. */
  readonly tailwindEntry: string;
  /** The style's effects CSS: rules under `.uiify-<recipe>…` selectors that utilities cannot express. */
  readonly effectsCss: string;
}

/** Every generated file starts with the layer order, so import order never changes precedence. */
const LAYER_ORDER =
  "@layer theme,base,components,utilities;@layer components.ui,components.uiify,components.app;";

const designSystems = new Map<string, ReturnType<typeof __unstable__loadDesignSystem>>();

async function entrySource(tailwindEntry: string) {
  return { css: await readFile(tailwindEntry, "utf8"), base: dirname(tailwindEntry) };
}

/** Classes Tailwind (with this entry's theme and variants) generates no CSS for. */
export async function findUnknownClasses(
  classes: readonly string[],
  tailwindEntry: string,
): Promise<string[]> {
  let loading = designSystems.get(tailwindEntry);
  if (!loading) {
    loading = entrySource(tailwindEntry).then(({ css, base }) =>
      __unstable__loadDesignSystem(css, { base }),
    );
    designSystems.set(tailwindEntry, loading);
  }
  const designSystem = await loading;
  const unique = [...new Set(classes)];
  const css = designSystem.candidatesToCss(unique);
  return unique.filter((_, index) => css[index] === null);
}

/**
 * Split Tailwind output into what the style owns (component layers and Tailwind's `@property`
 * registrations) and the `@layer theme` block; everything else is dropped.
 */
function splitOutput(css: string): { rules: string; theme: string } {
  const rules = postcss.parse(css);
  const theme = postcss.root();
  // behavior.css is imported into `components`, which nests its `@property` registrations in that
  // layer; they are global, so hoist them to the top level before the layer blocks are filtered.
  rules.walkAtRules("property", (node) => {
    if (node.parent !== rules) rules.append(node);
  });
  rules.each((node) => {
    const isBlock = node.type === "atrule" && node.name === "layer" && node.nodes !== undefined;
    if (isBlock && node.params === "theme") {
      // Only Tailwind's own theme variables; nested sublayers are the imported theme file.
      const values = node.clone();
      values.each((child) => {
        if (child.type === "atrule" && child.name === "layer") child.remove();
      });
      theme.append(values);
      node.remove();
      return;
    }
    const keep =
      node.type === "atrule" &&
      (node.name === "property" || (isBlock && node.params.startsWith("components.")));
    if (!keep) node.remove();
  });
  return { rules: rules.toString(), theme: theme.toString() };
}

/** Owner recipe of a `.uiify-<name>…` selector or `uiify-<name>…` keyframes name. */
function ownerOf(identifier: string, names: readonly string[]): string | undefined {
  const match = /^\.?uiify-([a-z0-9-]+)/.exec(identifier.trim());
  if (!match?.[1]) return undefined;
  const id = match[1];
  return names
    .filter((name) => id === name || id.startsWith(`${name}-`))
    .sort((left, right) => right.length - left.length)[0];
}

function nodeOwner(node: ChildNode, names: readonly string[]): string | undefined {
  if (node.type === "rule") {
    const owners = new Set(node.selectors.map((selector) => ownerOf(selector, names)));
    return owners.size === 1 ? [...owners][0] : undefined;
  }
  if (node.type === "atrule" && node.name === "property" && node.params.startsWith("--uiify-")) {
    return ownerOf(`.${node.params.slice(2)}`, names);
  }
  if (node.type === "atrule" && node.name === "keyframes") return ownerOf(node.params, names);
  if (node.type === "atrule" && node.nodes) {
    const owners = new Set(node.nodes.map((child) => nodeOwner(child, names)));
    return owners.size === 1 ? [...owners][0] : undefined;
  }
  return undefined;
}

function prefixRules(container: Container, scope: string): void {
  container.walkRules((rule) => {
    if (
      rule.parent?.type === "atrule" &&
      (rule.parent as postcss.AtRule).name.endsWith("keyframes")
    ) {
      return;
    }
    rule.selectors = rule.selectors.map((selector) => `${scope} ${selector}`);
  });
}

/** Split effects CSS by owning recipe; every rule must belong to exactly one recipe. */
function partitionEffects(
  effectsCss: string,
  names: readonly string[],
  scope: string,
): Map<string, { plain: string; scoped: string }> {
  const parts = new Map<string, { plain: postcss.Root; scoped: postcss.Root }>();
  const root = postcss.parse(effectsCss);
  root.each((layer) => {
    if (layer.type === "comment") return;
    if (layer.type !== "atrule" || layer.name !== "layer" || !layer.nodes) {
      throw new Error("effects.css: wrap every rule in @layer components.uiify { … }");
    }
    layer.each((node) => {
      if (node.type === "comment") return;
      const owner = nodeOwner(node, names);
      if (!owner) {
        const label = node.type === "rule" ? node.selector : node.toString().split("{")[0]?.trim();
        throw new Error(`effects.css rule "${label}" does not belong to a recipe`);
      }
      const entry = parts.get(owner) ?? { plain: postcss.root(), scoped: postcss.root() };
      parts.set(owner, entry);
      for (const [target, prefixed] of [
        [entry.plain, false],
        [entry.scoped, true],
      ] as const) {
        const wrapper = postcss.atRule({ name: "layer", params: layer.params });
        const copy = node.clone();
        wrapper.append(copy);
        if (prefixed) prefixRules(wrapper, scope);
        target.append(wrapper);
      }
    });
  });
  return new Map(
    [...parts].map(([name, { plain, scoped }]) => [
      name,
      { plain: plain.toString(), scoped: scoped.toString() },
    ]),
  );
}

/**
 * Compile a style's recipes (and effects) through Tailwind into static CSS: validate syntax and
 * class names, generate `@apply` rules, let Tailwind resolve them, then keep only component layers
 * and `@property` rules. Theme values are not emitted; the consumer's Tailwind emits them.
 */
export async function compileStyle(
  style: Style,
  options: CompileStyleOptions,
): Promise<CompiledStyle> {
  const issues = style.recipes.flatMap(validateRecipeSyntax);
  if (issues.length > 0) {
    throw new Error(
      issues
        .map(
          ({ recipe, where, className, reason }) =>
            `Recipe "${recipe}" ${where}: ${className} (${reason})`,
        )
        .join("\n"),
    );
  }
  for (const recipe of style.recipes) {
    const classes = recipeClassLists(recipe).flatMap(([, list]) => list.split(" ").filter(Boolean));
    const unknown = await findUnknownClasses(classes, options.tailwindEntry);
    if (unknown.length > 0) {
      throw new Error(`Recipe "${recipe.name}" uses unknown classes: ${unknown.join(" ")}`);
    }
  }

  const scope = `[data-style="${style.name}"]`;
  const names = style.recipes.map((recipe) => recipe.name);
  const effects = partitionEffects(options.effectsCss, names, scope);
  const entry = await entrySource(options.tailwindEntry);
  const build = async (body: string) => {
    const compiler = await compile(`${entry.css}\n${body}`, {
      base: entry.base,
      onDependency() {},
    });
    return splitOutput(optimize(compiler.build([]), { minify: true }).code);
  };
  const source = (recipe: Style["recipes"][number], scoped: boolean) =>
    recipeToApplyCss(recipe, scoped ? { scope } : {}) +
    ((scoped ? effects.get(recipe.name)?.scoped : effects.get(recipe.name)?.plain) ?? "");

  const whole = await build(style.recipes.map((recipe) => source(recipe, false)).join("\n"));
  const scoped =
    LAYER_ORDER +
    (await build(style.recipes.map((recipe) => source(recipe, true)).join("\n"))).rules;
  const perRecipe = new Map<string, string>();
  for (const recipe of style.recipes) {
    const imports = (recipe.requires ?? []).map((name) => `@import "./${name}.css";`).join("");
    perRecipe.set(recipe.name, LAYER_ORDER + imports + (await build(source(recipe, false))).rules);
  }
  return { all: LAYER_ORDER + whole.rules, perRecipe, scoped, theme: whole.theme };
}
