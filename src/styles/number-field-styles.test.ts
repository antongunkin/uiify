import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/number-field.css"), "utf8");

describe("NumberField styles", () => {
  it("styles the documented Group wrapper and its public controls", () => {
    expect(css).toContain('[data-uiify-number-field] > [data-part="group"]');
    expect(css).toContain('[data-part="group"] > [role="spinbutton"]');
    expect(css).toContain('[data-part="group"] > [data-part="increment"]');
    expect(css).toContain('[data-part="group"] > [data-part="decrement"]');
  });

  it("hides generated arrows from assistive technology and mirrors them in RTL", () => {
    expect(css).toMatch(/content:\s*"←"\s*\/\s*"";/);
    expect(css).toMatch(/content:\s*"→"\s*\/\s*"";/);
    expect(css).toMatch(/\[data-uiify-number-field\]:dir\(rtl\)[\s\S]*?scale:\s*-1 1;/);
  });
});
