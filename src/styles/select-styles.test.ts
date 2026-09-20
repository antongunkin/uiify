import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/select.css"), "utf8");
describe("Select skin", () => {
  it("keeps the native checkmark at the DropdownMenu radio-indicator size", () => {
    const checkmarkRule = css.match(/\.uiify-select option::checkmark \{(?<body>[^}]*)\}/s);

    expect(checkmarkRule?.groups?.body).toContain("box-sizing: border-box");
    expect(checkmarkRule?.groups?.body).toContain("inline-size: 1.15rem");
    expect(checkmarkRule?.groups?.body).toContain("block-size: 1.15rem");
  });
});
