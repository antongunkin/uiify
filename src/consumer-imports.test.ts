import { describe, expect, it } from "vitest";

describe("uiify consumer entrypoints", () => {
  it("exposes the documented public subpaths", async () => {
    const [root, hooks, core, components, toggleGroupClient, segmentedControlClient] =
      await Promise.all([
        import("@gunkin/uiify"),
        import("@gunkin/uiify/hooks"),
        import("@gunkin/uiify/core"),
        import("@gunkin/uiify/components/virtual-scroll"),
        import("@gunkin/uiify/components/toggle-group/client"),
        import("@gunkin/uiify/components/segmented-control/client"),
      ]);

    expect(root.Button).toBeDefined();
    expect(root.Toast).toBeDefined();
    expect(root.useToast).toBeDefined();
    expect(hooks).toBeDefined();
    expect(core).toBeDefined();
    expect(components).toBeDefined();
    expect(toggleGroupClient.ToggleGroupClient).toBeDefined();
    expect(segmentedControlClient.SegmentedControlClient).toBeDefined();
  });
});
