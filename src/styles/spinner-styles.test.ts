import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/spinner.css"), "utf8");

describe("Spinner styles", () => {
  it("moves both arc ends clockwise and keeps a 10% minimum", () => {
    expect(css).toMatch(
      /@keyframes uiify-spinner-orbit[\s\S]*?0%[\s\S]*?--uiify-spinner-tail: 0deg;[\s\S]*?--uiify-spinner-length: 36deg;[\s\S]*?50%[\s\S]*?--uiify-spinner-tail: 90deg;[\s\S]*?--uiify-spinner-length: 324deg;[\s\S]*?100%[\s\S]*?--uiify-spinner-tail: 360deg;[\s\S]*?--uiify-spinner-length: 36deg;/,
    );
    expect(css).toContain("from calc(-90deg + var(--uiify-spinner-tail))");
    expect(css).toContain("currentcolor 0 var(--uiify-spinner-length)");
    expect(css).toContain(
      "mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
    );
    expect(css).toContain("uiify-spinner-rotate 2s linear infinite");
    expect(css).toContain("uiify-spinner-orbit 1.5s ease-in-out infinite");
  });

  it("defines small, default, and large sizes", () => {
    expect(css).toContain('[data-size="small"]');
    expect(css).toContain('[data-size="default"]');
    expect(css).toContain('[data-size="large"]');
  });
});
