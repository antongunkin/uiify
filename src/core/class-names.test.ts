import { expect, it } from "vitest";
import { cn } from "./class-names.js";

it("joins truthy parts and returns undefined when nothing is left", () => {
  expect(cn("a", undefined, false, null, "", "b")).toBe("a b");
  expect(cn(undefined, "")).toBeUndefined();
});
