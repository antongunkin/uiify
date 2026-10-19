import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import componentTiers from "./component-tiers.json";
import * as core from "./core/index.js";

const sourceDirectory = import.meta.dirname;

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function sourceFiles(directory: string): string[] {
  return files(directory).filter((path) => /\.tsx?$/.test(path) && !/\.test\.[jt]sx?$/.test(path));
}

test("i18n rules cite helpers exported by uiify/core", () => {
  expect(core.resolveDirection).toBeTypeOf("function");
  expect(core.isComposingKeyEvent).toBeTypeOf("function");
  expect(core.formatLabel).toBeTypeOf("function");
});

test("Intl constructors use an explicit locale", () => {
  const implementation = sourceFiles(sourceDirectory).filter(
    (path) => !path.endsWith("i18n-rules.test.ts"),
  );
  const invalidLocale = /(?:new\s+)?Intl\.\w+\s*\(\s*(?:undefined\s*)?(?:,\s*[^)]*)?\)/;
  const violations = implementation.filter((path) =>
    invalidLocale.test(readFileSync(path, "utf8")),
  );

  expect(violations).toEqual([]);
});

test("component label templates do not concatenate a value and labels", () => {
  const components = sourceFiles(resolve(sourceDirectory, "components"));
  const concatenation = /\$\{[^}]*labels\.[^}]*\}\s+\$\{|\$\{[^}]+\}\s+\$\{[^}]*labels\./;
  const violations = components.filter((path) => concatenation.test(readFileSync(path, "utf8")));

  expect(violations).toEqual([]);
});

test("horizontal key handlers read direction at event time", () => {
  const components = sourceFiles(resolve(sourceDirectory, "components"));
  const violations = components.filter((path) => {
    const source = readFileSync(path, "utf8");
    return /ArrowLeft|ArrowRight/.test(source) && /useDirection\s*\(/.test(source);
  });

  expect(violations).toEqual([]);
});

test("every keyboard handler for an input guards IME composition", () => {
  const components = sourceFiles(resolve(sourceDirectory, "components"));
  const violations: string[] = [];
  const handler =
    /(?:const|function)\s+(?:handleKeyDown|onKeyDown)\s*=\s*\(event:\s*KeyboardEvent<HTMLInputElement>\)[^=]*=>\s*\{|function\s+(?:handleKeyDown|onKeyDown)\(event:\s*KeyboardEvent<HTMLInputElement>\)[^{]*\{/g;

  for (const path of components) {
    const source = readFileSync(path, "utf8");
    if (!/(?:<input\b|defaultTag:\s*["']input["'])/.test(source)) continue;

    for (const match of source.matchAll(handler)) {
      const start = match.index + match[0].length;
      let depth = 1;
      let end = start;
      while (end < source.length && depth > 0) {
        if (source[end] === "{") depth += 1;
        if (source[end] === "}") depth -= 1;
        end += 1;
      }
      if (!source.slice(start, end).includes("isComposingKeyEvent(event)")) violations.push(path);
    }
  }

  expect([...new Set(violations)]).toEqual([]);
});

test("every component with horizontal arrow handling is in the RTL fixture matrix", () => {
  const componentDirectory = resolve(sourceDirectory, "components");
  const fixtureSource = readFileSync(
    resolve(sourceDirectory, "../../../e2e/specs/i18n-fixtures.spec.ts"),
    "utf8",
  );
  const fixtures = new Set(
    [...fixtureSource.matchAll(/\{\s*name:\s*["']([^"']+)["']/g)].map((match) => match[1]),
  );
  const arrowHandlers = Object.keys(componentTiers.components).filter((name) => {
    const sourcePath = resolve(componentDirectory, name);
    return (
      readdirSync(componentDirectory, { withFileTypes: true }).some(
        (entry) => entry.isDirectory() && entry.name === name,
      ) &&
      sourceFiles(sourcePath).some((path) => {
        const source = readFileSync(path, "utf8");
        return source.includes("ArrowLeft") || source.includes("ArrowRight");
      })
    );
  });

  expect(arrowHandlers.filter((name) => !fixtures.has(name))).toEqual([]);
});

test("script-sensitive typography is scoped or explicitly allow-listed", () => {
  const stylesDirectory = resolve(sourceDirectory, "styles");
  const styles = files(stylesDirectory).filter((path) => path.endsWith(".css"));
  const allowListed = [
    { file: "reset.css", selector: "input" },
    { file: "reset.css", selector: "button" },
    { file: "reset.css", selector: "textarea" },
    { file: "reset.css", selector: "select" },
    { file: "line-chart.css", selector: "data-uiify-line-chart] > figcaption" },
    { file: "candle-chart.css", selector: "data-uiify-candle-chart] > figcaption" },
    { file: "carousel.css", selector: '[data-part="story-topline"]' },
    { file: "carousel.css", selector: '[data-part="story-footer"]' },
    { file: "carousel.css", selector: '[data-part="story-eyebrow"]' },
    { file: "carousel.css", selector: '[data-part="story-body"] > h3' },
  ];
  const violations = styles.flatMap((path) => {
    const source = readFileSync(path, "utf8");
    return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter((match) => {
        const selector = match[1] ?? "";
        const declarations = match[2] ?? "";
        return (
          /(?:letter-spacing|text-transform)\s*:/.test(declarations) &&
          !/:lang\(/.test(selector) &&
          !allowListed.some(
            (allowed) => path.endsWith(allowed.file) && selector.includes(allowed.selector),
          )
        );
      })
      .map(() => path);
  });

  expect([...new Set(violations)]).toEqual([]);

  const scriptTypography = readFileSync(resolve(stylesDirectory, "i18n.css"), "utf8");
  for (const locale of ["ja", "zh-Hans", "ar"]) {
    expect(scriptTypography).toMatch(new RegExp(`:lang\\(${locale}\\)[\\s\\S]*?font-family:`));
  }
});

test("generated directional glyphs use empty alternative text", () => {
  const styles = files(resolve(sourceDirectory, "styles")).filter((path) => path.endsWith(".css"));
  const violations = styles.flatMap((path) => {
    const source = readFileSync(path, "utf8");
    return [...source.matchAll(/content\s*:\s*["'][←→↑↓]["']\s*(?:\/\s*["'][^"']*["'])?/g)]
      .filter((match) => !/\/\s*["']["']/.test(match[0]))
      .map(() => path);
  });

  expect([...new Set(violations)]).toEqual([]);
});
