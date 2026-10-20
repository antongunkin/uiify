/**
 * Sanity check that the root barrel can be imported.
 * Each component task's individual entry has its own test file.
 */
import { describe, expect, it } from "vitest";

describe("@gunkin/uiify/components root barrel", () => {
  // The barrel pulls in all 54 components plus @gunkin/uiify/core and @gunkin/uiify/hooks, so this
  // is dominated by Vite transform cost, not test logic. On a cold cache or a
  // loaded CI worker that legitimately exceeds the 5s default and the suite
  // fails for a reason unrelated to what it asserts.
  it("imports without error", { timeout: 60_000 }, async () => {
    // Dynamic import exercises the module resolution path.
    await import("./index.js");
  });

  it("exports the static AspectRatio block", async () => {
    const components = await import("./index.js");
    expect(components.AspectRatio).toBeTypeOf("function");
  });

  it("exports the static foundations", async () => {
    const components = await import("./index.js");
    expect(components.Badge).toBeTypeOf("function");
    expect(components.Card).toBeTypeOf("function");
    expect(components.Progress).toBeTypeOf("function");
    expect(components.Avatar).toBeTypeOf("function");
    expect(components.Alert).toBeTypeOf("function");
  });

  it("does not export the removed standalone Separator component", async () => {
    const components = await import("./index.js");
    expect(components).not.toHaveProperty("Separator");
  });

  it("does not export the removed ScrollArea component", async () => {
    const components = await import("./index.js");
    expect(components).not.toHaveProperty("ScrollArea");
  });
});
