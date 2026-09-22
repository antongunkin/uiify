import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeCss } from "../components/behavior-css.test";

const css = normalizeCss(readFileSync(resolve(import.meta.dirname, "base.css"), "utf8"));

describe("base positioning skin", () => {
  it("keeps native geometry in behavior.css", () => {
    expect(css).not.toContain("position-area");
    expect(css).toContain(
      '[data-positioning="native"] { --uiify-anchor-offset: var(--space-sm); }',
    );
  });

  it("restores the user-agent popover margin only for non-native surfaces", () => {
    expect(css).toContain(
      '[popover]:popover-open:not([data-positioning="native"]) { margin: revert; }',
    );
  });
});
