import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

const packageRoot = resolve(import.meta.dirname, "..");
function hasClientDirective(text: string): boolean {
  const file = ts.createSourceFile(
    "module.tsx",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  for (const statement of file.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) break;
    if (statement.expression.text === "use client") return true;
  }
  return false;
}
const source = (path: string) => readFileSync(resolve(packageRoot, "src", path), "utf8");
const dist = (path: string) => readFileSync(resolve(packageRoot, "dist", path), "utf8");
function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

it.each([
  // Hook modules
  "hooks/use-click-outside.ts",
  "hooks/use-controllable-state.ts",
  "hooks/use-debounce.ts",
  "hooks/use-debounced-callback.ts",
  "hooks/use-event-callback.ts",
  "hooks/use-event-listener.ts",
  "hooks/use-focus-within.ts",
  "hooks/use-hover.ts",
  "hooks/use-id.ts",
  "hooks/use-intersection-observer.ts",
  "hooks/use-interval.ts",
  "hooks/use-is-mounted.ts",
  "hooks/use-isomorphic-layout-effect.ts",
  "hooks/use-local-storage.ts",
  "hooks/use-lock-body-scroll.ts",
  "hooks/use-media-query.ts",
  "hooks/use-merged-refs.ts",
  "hooks/use-previous.ts",
  "hooks/use-ref-element.ts",
  "hooks/use-resize-observer.ts",
  "hooks/use-throttled-callback.ts",
  "hooks/use-timeout.ts",
  "hooks/use-timer.ts",
  "hooks/use-toggle.ts",
  "hooks/use-unmount.ts",
  "hooks/use-update-effect.ts",
  "hooks/use-window-size.ts",
  "hooks/use-chart-viewport.ts",
  // Core modules
  "core/anchor.tsx",
  "core/collection.tsx",
  "core/direction.tsx",
  "core/dismissable-layer.tsx",
  "core/focus-scope.tsx",
  "core/portal.tsx",
  "core/presence.tsx",
  "core/roving-focus.tsx",
  "core/use-controllable-open-change.ts",
  "core/use-dialog.ts",
  "core/use-popover.ts",
  "core/use-anchor-position.ts",
  // Component modules
  "components/carousel/client/CarouselClient.tsx",
  "components/carousel/fade/FadeCarouselClient.tsx",
  "components/checkbox/Checkbox.tsx",
  "components/color-picker/ColorPicker.tsx",
  "components/combobox/Combobox.tsx",
  "components/context-menu/ContextMenu.tsx",
  "components/drawer/Drawer.tsx",
  "components/dropdown-menu/DropdownMenu.tsx",
  "components/file-upload/FileUpload.tsx",
  "components/header/Header.tsx",
  "components/header/use-header-scroll-state.ts",
  "components/header/use-header.ts",
  "components/hover-card/HoverCard.tsx",
  "components/number-field/NumberField.tsx",
  "components/number-field/use-press-repeat.ts",
  "components/otp-input/OtpInput.tsx",
  "components/pagination/Pagination.tsx",
  "components/pagination/use-pagination.ts",
  "components/table/Table.tsx",
  "components/tags-input/TagsInput.tsx",
  "components/toast/Toast.tsx",
  "components/toolbar/Toolbar.tsx",
  "components/tooltip/Tooltip.tsx",
  "components/virtual-scroll/VirtualScroll.tsx",
  "components/virtual-scroll/VirtualScrollRowShell.tsx",
  // Client entries remain covered here.
  "components/modal/client/ModalClientContent.tsx",
  "components/enhance/UIEnhance.tsx",
  // Controlled Rating remains a separate client-only entry.
  "components/rating/client/RatingClient.tsx",
  "components/candle-chart/client/CandleChartClient.tsx",
  "components/line-chart/client/LineChartClient.tsx",
])("declares its client boundary in %s", (path) => {
  expect(hasClientDirective(source(path)), path).toBe(true);
});

it.each([
  // pure/neutral files the brief calls out directly
  "components/modal/ModalParts.tsx",
  "core/render.ts",
  "core/use-render-element.tsx",
  // barrels — never get a shared "use client"
  "components/index.ts",
  "core/index.ts",
  "hooks/index.ts",
  // Anchor-position helpers stay neutral.
  "core/anchor-position.ts",
  "core/anchor-position/props.ts",
  // Shared choice-family primitive — Tier 0, no hooks, no "use client"
  "components/internal/choice-family/ChoiceGroup.tsx",
  // Default Rating entry is server/Tier 0; controlled mode
  // lives in the separate components/rating/client/RatingClient.tsx entry
  "components/rating/Rating.tsx",
  "components/rating/rating-items.tsx",
  // Framework-agnostic DOM command listener, no hooks, no React
  // dependency at all — importable from client or server modules alike.
  "components/carousel/commands.ts",
  "components/carousel/Carousel.tsx",
  "components/carousel/CarouselMarkup.tsx",
])("keeps pure source %s neutral", (path) => {
  expect(hasClientDirective(source(path)), path).toBe(false);
});

it("emits a neutral root and canonical implementation modules", () => {
  expect(hasClientDirective(dist("index.js"))).toBe(false);
  expect(hasClientDirective(dist("components/index.js"))).toBe(false);
  expect(hasClientDirective(dist("core/index.js"))).toBe(false);
  expect(hasClientDirective(dist("components/modal/ModalParts.js"))).toBe(false);
  expect(hasClientDirective(dist("components/number-field/NumberField.js"))).toBe(true);
  expect(dist("components/modal.js").trim()).toBe('export * from "./modal/index.js";');
  expect(dist("components/modal/client.js").trim()).toBe('export * from "./client/index.js";');
  expect(dist("components/candle-chart/client.js").trim()).toBe(
    'export * from "./client/index.js";',
  );
  expect(dist("components/line-chart/client.js").trim()).toBe('export * from "./client/index.js";');
});

it("emits every production module with its own source directive", () => {
  const configPath = resolve(packageRoot, "tsconfig.build.json");
  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  expect(loaded.error).toBeUndefined();
  const parsed = ts.parseJsonConfigFileContent(loaded.config, ts.sys, packageRoot);
  expect(parsed.errors).toEqual([]);
  expect(parsed.fileNames.length).toBeGreaterThan(200);
  for (const input of parsed.fileNames.filter((file) => !file.endsWith(".d.ts"))) {
    const relativePath = input.slice(resolve(packageRoot, "src").length + 1).replace(/\.tsx?$/, "");
    const emitted = dist(`${relativePath}.js`);
    expect(hasClientDirective(emitted), relativePath).toBe(
      hasClientDirective(readFileSync(input, "utf8")),
    );
    expect(existsSync(resolve(packageRoot, "dist", `${relativePath}.d.ts`)), relativePath).toBe(
      true,
    );
  }
});

it("ships no development modules or stale removed utilities", () => {
  const files = walk(resolve(packageRoot, "dist"));
  expect(files.length).toBeGreaterThan(200);
  expect(
    files.filter((file) => /\.test\.|\.stories\.|test-utils|tier-manifest|merge-props/.test(file)),
  ).toEqual([]);
});

it("keeps every relative emitted import resolvable", () => {
  for (const path of walk(resolve(packageRoot, "dist")).filter((file) => file.endsWith(".js"))) {
    const text = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    function visit(node: ts.Node): void {
      let specifier: string | undefined;
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        specifier = node.moduleSpecifier.text;
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        specifier = node.arguments[0].text;
      }
      if (specifier?.startsWith(".")) {
        expect(specifier, path).not.toMatch(/\.tsx?$/);
        expect(existsSync(resolve(path, "..", specifier)), `${path} -> ${specifier}`).toBe(true);
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
});
