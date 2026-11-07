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
  test("authored styles use Tailwind scales instead of legacy spacing and type tokens", () => {
    const generatedRoot = resolve(stylesRoot, "generated");
    const source = cssSources(stylesRoot)
      .filter((path) => !path.startsWith(`${generatedRoot}/`) && !path.endsWith(".generated.css"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(source).not.toMatch(/var\(--(?:space|text)-/);
  });

  test("active styles do not require legacy BEM UIify classes", () => {
    for (const path of cssSources(stylesRoot)) {
      // `::view-transition-*(.name)` selects a view-transition-class, not a DOM class.
      const source = readFileSync(path, "utf8").replace(
        /::view-transition-(?:group|image-pair|old|new)\([^)]*\)/g,
        "",
      );
      // Identity classes (`.uiify-native-dialog-content`) are the contract; BEM forms are legacy.
      expect(source, path).not.toMatch(/\.uiify-[a-z0-9-]*(?:__|--)/);
    }
  });

  test("active styles use canonical component identity and anatomy selectors", () => {
    const source = cssSources(stylesRoot)
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(source).toContain(".uiify-button");
    expect(source).not.toMatch(/data-uiify-|\[data-part=/);
    expect(source).not.toContain("uiify-button--");
    expect(source).not.toContain("uiify-native-dialog__");
    expect(source).not.toContain("uiify-native-popover__");
  });

  test("drawer geometry is scoped to the content part", () => {
    const source = readFileSync(resolve(stylesRoot, "uiify/effects.css"), "utf8");

    expect(source).toContain('.uiify-drawer-content[data-side="bottom"]');
    expect(source).not.toMatch(/\.uiify-drawer-root(?:::|\s*\{)/);
  });

  test("migrated UIify sources use the Tailwind scales directly", () => {
    const migratedSources = [
      "base.css",
      "components/control-size.css",
      "components/dialog-surface.css",
      "tailwind-legacy.css",
      "uiify/effects.css",
      "layout/declarations.ts",
    ]
      .map((path) => readFileSync(resolve(stylesRoot, path), "utf8"))
      .join("\n");

    expect(migratedSources).not.toMatch(/var\(--(?:space|text)-/);
  });
});
