import type { Recipe } from "../define.js";
import { recipeClassLists } from "./parts.js";

export type RecipeIssueReason = "arbitrary" | "physical" | "important";

export interface RecipeIssue {
  readonly recipe: string;
  /** Location in the recipe, e.g. `base.root`, `variants.size.sm.title`, `compoundVariants[0].root`. */
  readonly where: string;
  readonly className: string;
  readonly reason: RecipeIssueReason;
}

/** The only bracket form allowed: attribute variants such as `data-[state=open]:`. */
const ATTRIBUTE_VARIANT = /^(group-|peer-|has-|in-)?(data|aria)-\[[a-z-]+(=[a-z0-9-]+)?\]$/;
/** Physical-direction utilities; recipes use logical ones (`ps-`, `me-`, `start-`, `border-s`…). */
const PHYSICAL =
  /^(p[lr]|m[lr]|scroll-[mp][lr]|left|right|border-[lr]|rounded-([lr]|[tb][lr])|text-(left|right)|float-(left|right)|clear-(left|right))(-|$)/;

/** Split `group-data-[x]:hover:px-4` on `:` outside brackets and parentheses. */
function segments(token: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const character of token) {
    if (character === "[" || character === "(") depth += 1;
    if (character === "]" || character === ")") depth -= 1;
    if (character === ":" && depth === 0) {
      result.push(current);
      current = "";
    } else current += character;
  }
  result.push(current);
  return result;
}

function classIssue(token: string): RecipeIssueReason | undefined {
  const variants = segments(token);
  const utility = variants.pop() ?? "";
  if (utility.startsWith("!") || utility.endsWith("!")) return "important";
  if (/[[(]/.test(utility)) return "arbitrary";
  if (variants.some((variant) => /[[(]/.test(variant) && !ATTRIBUTE_VARIANT.test(variant))) {
    return "arbitrary";
  }
  if (PHYSICAL.test(utility.replace(/^-/, ""))) return "physical";
  return undefined;
}

/** Syntax rules every recipe class obeys: no arbitrary syntax, no physical directions, no `!`. */
export function validateRecipeSyntax(recipe: Recipe): RecipeIssue[] {
  const issues: RecipeIssue[] = [];
  for (const [where, classes] of recipeClassLists(recipe)) {
    for (const className of classes.split(" ").filter(Boolean)) {
      const reason = classIssue(className);
      if (reason) issues.push({ recipe: recipe.name, where, className, reason });
    }
  }
  return issues;
}
