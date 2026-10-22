import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/select.css"), "utf8");
describe("Select skin", () => {
  it("clears Safari's user-agent padding on the picker icon so the chevron stays compact", () => {
    const body = css.match(/\[data-uiify-select\]::picker-icon \{(?<body>[^}]*)\}/s)?.groups?.body;

    expect(body).toContain("padding: 0;");
  });
});
