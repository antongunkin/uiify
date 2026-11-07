/** Whitespace-separated standard Tailwind classes. */
export type ClassList = string;

/** Classes for the root only, or per part (`root` plus the recipe's declared parts). */
export type PartClasses<P extends string> = ClassList | Partial<Record<"root" | P, ClassList>>;

export type VariantSelection<V extends Record<string, string>> = { readonly [A in keyof V]?: V[A] };

/** Compound variant: axis values plus `class`. With erased variant types (`Recipe`), any axis. */
export type CompoundVariant<
  V extends Record<string, string>,
  P extends string,
> = string extends keyof V
  ? {
      readonly class: PartClasses<string>;
      readonly [axis: string]: PartClasses<string> | undefined;
    }
  : VariantSelection<V> & { readonly class: PartClasses<P> };

export interface RecipeConfig<V extends Record<string, string>, P extends string> {
  /** Parts besides root. Class names: `uiify-<name>` (root), `uiify-<name>-<part>`. */
  readonly parts?: readonly P[];
  /**
   * Parts rendered as direct children of the root. Their rules under a root variant use the child
   * combinator; deeper parts use `@scope (root…) to (root)`, which Chromium matches 25–35% slower.
   */
  readonly childParts?: readonly P[];
  readonly base: PartClasses<P>;
  /** Axis `size` ↔ attribute `data-size`; value "true" ↔ presence `[data-x]`. Every value of V[A] is required. */
  readonly variants?: { readonly [A in keyof V]: { readonly [K in V[A]]: PartClasses<P> } };
  readonly compoundVariants?: ReadonlyArray<CompoundVariant<V, P>>;
  /** Value applied when the attribute is absent (`:not([data-axis])`). */
  readonly defaultVariants?: VariantSelection<V>;
  /** Recipes this component renders inside itself; per-component CSS imports them. */
  readonly requires?: readonly string[];
}

export interface Recipe<
  V extends Record<string, string> = Record<string, string>,
  P extends string = string,
> extends RecipeConfig<V, P> {
  readonly name: string;
}

export interface Style {
  readonly name: string;
  readonly recipes: readonly Recipe[];
}

/** Declare a component recipe. Identity at runtime; the types check variant coverage and parts. */
export function defineRecipe<
  V extends Record<string, string> = Record<never, string>,
  P extends string = never,
>(name: string, config: RecipeConfig<V, P>): Recipe<V, P> {
  return { name, ...config };
}

/** Group recipes into a named style; rejects duplicate names and unknown `requires`. */
export function defineStyle(name: string, recipes: readonly Recipe[]): Style {
  const names = new Set<string>();
  for (const recipe of recipes) {
    if (names.has(recipe.name)) throw new Error(`Duplicate recipe "${recipe.name}"`);
    names.add(recipe.name);
  }
  for (const recipe of recipes) {
    for (const required of recipe.requires ?? []) {
      if (!names.has(required)) {
        throw new Error(`Recipe "${recipe.name}" requires unknown "${required}"`);
      }
    }
  }
  return { name, recipes };
}
