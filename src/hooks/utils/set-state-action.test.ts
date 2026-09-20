import { describe, expect, it } from "vitest";
import { resolveSetStateAction } from "./set-state-action.js";

describe("resolveSetStateAction", () => {
  it("returns a direct value", () => {
    expect(resolveSetStateAction(2, 1)).toBe(2);
  });

  it("resolves a functional updater against the current snapshot", () => {
    expect(resolveSetStateAction((previous) => previous + 1, 3)).toBe(4);
  });
});
