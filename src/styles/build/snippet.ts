import type { Recipe } from "../define.js";
import { compoundSelection, partClasses, recipeAxes, recipeParts } from "./parts.js";

function camel(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

function key(name: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
}

function object(entries: ReadonlyArray<readonly [string, string]>): string {
  return `{ ${entries.map(([name, value]) => `${key(name)}: ${value}`).join(", ")} }`;
}

/** Classes one part gets for a variant selection, as `cva()` would return them (defaults applied). */
export function recipeClasses(
  recipe: Recipe,
  part: string,
  selection: Record<string, string | undefined>,
): string {
  const effective: Record<string, string | undefined> = { ...recipe.defaultVariants };
  for (const [axis, value] of Object.entries(selection))
    if (value !== undefined) effective[axis] = value;
  const classes = [partClasses(recipe.base, part)];
  for (const [axis, values] of recipeAxes(recipe)) {
    const chosen = values.find(([value]) => value === effective[axis]);
    if (chosen) classes.push(partClasses(chosen[1], part));
  }
  for (const compound of recipe.compoundVariants ?? []) {
    if (compoundSelection(compound).every(([axis, value]) => effective[axis] === value)) {
      classes.push(partClasses(compound.class, part));
    }
  }
  return classes.filter(Boolean).join(" ");
}

function partSnippet(recipe: Recipe, part: string, exportName: string, keepEmpty: boolean): string {
  const quote = (value: string) => JSON.stringify(value);
  const compounds = (recipe.compoundVariants ?? [])
    .map((compound) => [compoundSelection(compound), partClasses(compound.class, part)] as const)
    .filter(([, list]) => list);
  const compoundAxes = new Set(compounds.flatMap(([selection]) => selection.map(([axis]) => axis)));
  const variants = recipeAxes(recipe)
    .map(
      ([axis, values]) =>
        [
          axis,
          values.map(([value, classes]) => [value, partClasses(classes, part)] as const),
        ] as const,
    )
    .filter(
      ([axis, values]) => keepEmpty || compoundAxes.has(axis) || values.some(([, list]) => list),
    )
    .map(
      ([axis, values]) =>
        [axis, values.map(([value, list]) => [value, quote(list)] as const)] as const,
    );
  const axes = new Set(variants.map(([axis]) => axis));

  const head = `export const ${exportName} = cva(${quote(partClasses(recipe.base, part))}`;
  if (variants.length === 0 && compounds.length === 0) return `${head});\n`;
  const lines = [`${head}, {`];
  if (variants.length > 0) {
    lines.push(`  variants: ${object(variants.map(([axis, values]) => [axis, object(values)]))},`);
  }
  if (compounds.length > 0) {
    const items = compounds.map(([selection, list]) =>
      object([
        ...selection.map(([axis, value]) => [axis, quote(value)] as const),
        ["class", quote(list)],
      ]),
    );
    lines.push(`  compoundVariants: [${items.join(", ")}],`);
  }
  const defaults = Object.entries(recipe.defaultVariants ?? {}).filter(
    (entry): entry is [string, string] => axes.has(entry[0]) && typeof entry[1] === "string",
  );
  if (variants.length > 0 && defaults.length > 0) {
    lines.push(
      `  defaultVariants: ${object(defaults.map(([axis, value]) => [axis, quote(value)]))},`,
    );
  }
  lines.push("});");
  return `${lines.join("\n")}\n`;
}

/** Copyable `cva()` source for a recipe: one call, or one per part for multi-part recipes. */
export function recipeToCvaSnippet(recipe: Recipe): string {
  const name = camel(recipe.name);
  const parts = recipeParts(recipe);
  const calls =
    parts.length === 1
      ? [partSnippet(recipe, "root", name, true)]
      : parts.map((part) => partSnippet(recipe, part, `${name}${camel(`-${part}`)}`, false));
  return `import { cva } from "class-variance-authority";\n\n${calls.join("\n")}`;
}
