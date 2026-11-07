import { describe, expect, it } from "vitest";
import { defineRecipe } from "../define.js";
import { validateRecipeSyntax } from "./validate.js";
import { testButton, testModal } from "./test-utils.js";

function reasons(className: string) {
  return validateRecipeSyntax(defineRecipe("probe", { base: className })).map(
    (issue) => issue.reason,
  );
}

describe("validateRecipeSyntax", () => {
  it.each(["px-[13px]", "[box-shadow:x]", "[&:hover]:x", "px-(--gap)", "hover:w-[3rem]"])(
    "%s is arbitrary",
    (className) => expect(reasons(className)).toEqual(["arbitrary"]),
  );

  it.each([
    "data-[state=open]:bg-accent",
    "group-data-[disabled]:opacity-50",
    "aria-[sort=ascending]:font-medium",
    "peer-data-[state=checked]:text-foreground",
    "has-data-[slot=icon]:ps-3",
  ])("%s has no issue", (className) => expect(reasons(className)).toEqual([]));

  it.each([
    "pl-4",
    "mr-2",
    "text-left",
    "rounded-l-md",
    "rounded-tr-md",
    "border-r",
    "left-0",
    "-right-1",
    "hover:pr-2",
    "float-left",
  ])("%s is physical", (className) => expect(reasons(className)).toEqual(["physical"]));

  it.each(["!px-4", "px-4!"])("%s is important", (className) =>
    expect(reasons(className)).toEqual(["important"]),
  );

  it("accepts logical and standard classes", () => {
    expect(
      reasons("ps-4 me-2 text-start rounded-s-md border-e start-0 border-lime inset-x-0"),
    ).toEqual([]);
  });

  it("reports recipe, location and class", () => {
    const recipe = defineRecipe<{ size: "sm" }, "title">("dialog", {
      parts: ["title"],
      base: { root: "grid", title: "pl-2" },
      variants: { size: { sm: { title: "w-[3px]" } } },
      compoundVariants: [{ size: "sm", class: "!p-1" }],
    });
    expect(validateRecipeSyntax(recipe)).toEqual([
      { recipe: "dialog", where: "base.title", className: "pl-2", reason: "physical" },
      {
        recipe: "dialog",
        where: "variants.size.sm.title",
        className: "w-[3px]",
        reason: "arbitrary",
      },
      {
        recipe: "dialog",
        where: "compoundVariants[0].root",
        className: "!p-1",
        reason: "important",
      },
    ]);
  });

  it("test recipes are valid", () => {
    expect([...validateRecipeSyntax(testButton), ...validateRecipeSyntax(testModal)]).toEqual([]);
  });
});
