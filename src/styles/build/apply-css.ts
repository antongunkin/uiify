import type { PartClasses, Recipe } from "../define.js";
import { compoundSelection, partClasses, recipeAxes, recipeParts } from "./parts.js";

export interface ApplyCssOptions {
  /** Cascade sub-layer: `uiify` for library styles, `app` for consumer styles that must win. */
  readonly layer?: "uiify" | "app";
  /** Ancestor selector prefixed to every rule, for previewing several styles on one page. */
  readonly scope?: string;
}

function kebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Attribute conditions matching one axis value; the default value also matches absence. */
function valueConditions(recipe: Recipe, axis: string, value: string): string[] {
  const attribute = `data-${kebab(axis)}`;
  const conditions = [value === "true" ? `[${attribute}]` : `[${attribute}="${value}"]`];
  if (recipe.defaultVariants?.[axis] === value) conditions.push(`:not([${attribute}])`);
  return conditions;
}

function crossProduct(lists: readonly string[][]): string[] {
  return lists.reduce<string[]>(
    (combined, list) => combined.flatMap((prefix) => list.map((item) => prefix + item)),
    [""],
  );
}

/**
 * Compile a recipe into `@apply` rules keyed by `uiify-*` classes. Variants are data attributes on
 * the root. Part rules under a root variant never reach a nested instance of the same component:
 * `childParts` use `root[variant] > part`, other parts `@scope (root[variant]) to (root)`.
 */
export function recipeToApplyCss(recipe: Recipe, options: ApplyCssOptions = {}): string {
  const root = `.uiify-${recipe.name}`;
  const prefix = options.scope ? `${options.scope} ` : "";
  const parts = recipeParts(recipe);
  const lines: string[] = [];
  const rule = (selector: string, classes: string, indent = "  ") => {
    if (classes) lines.push(`${indent}${selector} { @apply ${classes}; }`);
  };
  const partSelector = (part: string) => (part === "root" ? root : `${root}-${part}`);

  const conditional = (conditions: string[], classes: PartClasses<string>) => {
    const roots = conditions.map((condition) => `${prefix}${root}${condition}`).join(", ");
    rule(roots, partClasses(classes, "root"));
    const lists = parts
      .slice(1)
      .map((part) => [part, partClasses(classes, part)] as const)
      .filter(([, list]) => list);
    const children = new Set<string>(recipe.childParts ?? []);
    for (const [part, list] of lists.filter(([part]) => children.has(part))) {
      const selectors = conditions.map(
        (condition) => `${prefix}${root}${condition} > ${partSelector(part)}`,
      );
      rule(selectors.join(", "), list);
    }
    const scoped = lists.filter(([part]) => !children.has(part));
    if (scoped.length === 0) return;
    lines.push(`  @scope (${roots}) to (${root}) {`);
    for (const [part, list] of scoped) rule(partSelector(part), list, "    ");
    lines.push("  }");
  };

  for (const part of parts) rule(`${prefix}${partSelector(part)}`, partClasses(recipe.base, part));
  for (const [axis, values] of recipeAxes(recipe)) {
    for (const [value, classes] of values) {
      conditional(valueConditions(recipe, axis, value), classes);
    }
  }
  for (const compound of recipe.compoundVariants ?? []) {
    const conditions = crossProduct(
      compoundSelection(compound).map(([axis, value]) => valueConditions(recipe, axis, value)),
    );
    conditional(conditions, compound.class);
  }

  return `@layer components.${options.layer ?? "uiify"} {\n${lines.join("\n")}\n}\n`;
}
