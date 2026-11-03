import { describe, expect, it } from "vitest";
import { layoutAttributes } from "./attributes.js";
import { layoutPartProps, layoutResponsiveProps } from "./values.js";

describe("layout domains and attributes", () => {
  it("projects finite shared geometry and typography domains", () => {
    expect(layoutPartProps.Grid.columns).toContain(12);
    expect(layoutPartProps.Grid.columns).toContain("2:1");
    expect(layoutPartProps.Heading.level).toEqual([1, 2, 3, 4, 5, 6]);
    expect(layoutResponsiveProps.Heading).toContain("measure");
    expect(layoutResponsiveProps.Box).not.toContain("container");
  });
  it("retains legacy scalar markup and omits unset values", () => {
    expect(layoutAttributes("Stack", { direction: "inline", gap: "md", wrap: false })).toEqual({
      "data-ui-layout": "stack",
      "data-direction": "inline",
      "data-gap": "md",
    });
    expect(layoutAttributes("Section", {})).toEqual({ "data-ui-layout": "section" });
  });
  it("serializes conditions, explicit false resets and logical names", () => {
    expect(
      layoutAttributes("Stack", {
        paddingInline: { md: "lg" },
        wrap: { base: true, md: false },
        responsive: "viewport",
        container: true,
      }),
    ).toEqual({
      "data-ui-layout": "stack",
      "data-md-padding-inline": "lg",
      "data-wrap": "true",
      "data-md-wrap": "false",
      "data-responsive": "viewport",
      "data-container": "true",
    });
  });
  it("ignores native props and unsupported own props", () => {
    expect(layoutAttributes("Text", { id: "x", columns: 2, size: "sm" })).toEqual({
      "data-ui-text": "text",
      "data-size": "sm",
    });
  });
});
