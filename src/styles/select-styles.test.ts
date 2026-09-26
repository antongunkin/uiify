import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/select.css"), "utf8");
describe("Select skin", () => {
  it("keeps the native checkmark at the DropdownMenu radio-indicator size", () => {
    const checkmarkRule = css.match(/\[data-uiify-select\] option::checkmark \{(?<body>[^}]*)\}/s);

    expect(checkmarkRule?.groups?.body).toContain("box-sizing: border-box");
    expect(checkmarkRule?.groups?.body).toContain("inline-size: 1.15rem");
    expect(checkmarkRule?.groups?.body).toContain("block-size: 1.15rem");
  });

  it("draws the checkmark with a mask, not a font glyph that each engine centres differently", () => {
    const body = css.match(/\[data-uiify-select\] option::checkmark \{(?<body>[^}]*)\}/s)?.groups
      ?.body;

    expect(body).toContain('content: "";');
    expect(body).toContain("mask-composite: exclude;");
    expect(body).not.toContain("\\2713");
  });

  it("clears Safari's user-agent padding on the picker icon so the chevron stays compact", () => {
    const body = css.match(/\[data-uiify-select\]::picker-icon \{(?<body>[^}]*)\}/s)?.groups?.body;

    expect(body).toContain("padding: 0;");
  });
});
