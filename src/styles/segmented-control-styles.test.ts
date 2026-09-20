import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/segmented-control.css"), "utf8");

describe("Segmented Control styles", () => {
  it("makes full-width controls fill the inline axis and distribute segments", () => {
    expect(css).toContain("[data-uiify-segmented-control][data-full-width]");
    expect(css).toContain("inline-size: 100%");
    expect(css).toContain("flex: 1 1 0");
    expect(css).toContain('[data-uiify-segmented-control][data-orientation="vertical"]');
    expect(css).toContain("flex-direction: column");
  });
});
