import type { PartClasses, Recipe } from "../define.js";

/** `root` followed by the recipe's declared parts, in declaration order. */
export function recipeParts(recipe: Recipe): string[] {
  return ["root", ...(recipe.parts ?? [])];
}

/** Normalized class list of one part; a plain string belongs to `root`. */
export function partClasses(classes: PartClasses<string> | undefined, part: string): string {
  const list = typeof classes === "string" ? (part === "root" ? classes : "") : classes?.[part];
  return (list ?? "").split(/\s+/).filter(Boolean).join(" ");
}

/** Variant axes of a recipe with their values, in declaration order. */
export function recipeAxes(
  recipe: Recipe,
): Array<[axis: string, values: Array<[string, PartClasses<string>]>]> {
  return Object.entries(recipe.variants ?? {}).map(([axis, values]) => [
    axis,
    Object.entries(values as Record<string, PartClasses<string>>),
  ]);
}

/** Axis → value pairs of a compound variant (everything except `class`). */
export function compoundSelection(
  compound: Readonly<Record<string, unknown>>,
): Array<[axis: string, value: string]> {
  return Object.entries(compound).filter(
    (entry): entry is [string, string] => entry[0] !== "class" && typeof entry[1] === "string",
  );
}

/** Every class list of a recipe with its location (`base.root`, `variants.size.sm.title`, …). */
export function recipeClassLists(recipe: Recipe): Array<[where: string, classes: string]> {
  const lists: Array<[string, string]> = [];
  const add = (where: string, classes: PartClasses<string>) => {
    const parts = typeof classes === "string" ? ["root"] : Object.keys(classes);
    for (const part of parts) lists.push([`${where}.${part}`, partClasses(classes, part)]);
  };
  add("base", recipe.base);
  for (const [axis, values] of recipeAxes(recipe)) {
    for (const [value, classes] of values) add(`variants.${axis}.${value}`, classes);
  }
  recipe.compoundVariants?.forEach((compound, index) =>
    add(`compoundVariants[${index}]`, compound.class),
  );
  return lists;
}
