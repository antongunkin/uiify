import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "components/drawer.css"), "utf8").replace(
  /\s+/g,
  " ",
);

describe("Drawer skin: physical sides", () => {
  it("keeps side=right on the physical right in RTL", () => {
    expect(css).toMatch(
      /:dir\(rtl\) \[data-uiify-drawer\]\[data-part="content"\]\[data-side="right"\] \{[^}]*margin-inline: 0 auto;/,
    );
  });

  it("keeps side=left on the physical left in RTL", () => {
    expect(css).toMatch(
      /:dir\(rtl\) \[data-uiify-drawer\]\[data-part="content"\]\[data-side="left"\] \{[^}]*margin-inline: auto 0;/,
    );
  });
});
