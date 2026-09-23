import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const stylesRoot = resolve(import.meta.dirname);

function cssSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return cssSources(path);
    return entry.name.endsWith(".css") ? [path] : [];
  });
}

describe("strict styling contract", () => {
  test("active styles do not require legacy UIify classes", () => {
    for (const path of cssSources(stylesRoot)) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toMatch(/\.uiify-[a-z0-9_-]+/);
    }
  });

  test("active styles use canonical component identity and anatomy selectors", () => {
    const source = cssSources(stylesRoot)
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(source).toContain("[data-uiify-button]");
    expect(source).toContain("[data-part=");
    expect(source).not.toContain("uiify-button--");
    expect(source).not.toContain("uiify-dialog__");
    expect(source).not.toContain("uiify-popover__");
  });

  test("drawer geometry is scoped to the content part", () => {
    const source = readFileSync(resolve(stylesRoot, "components/drawer.css"), "utf8");

    expect(source).toContain('[data-uiify-drawer][data-part="content"]');
    expect(source).not.toMatch(/\[data-uiify-drawer\](?:::|\s*\{)/);
  });
});
