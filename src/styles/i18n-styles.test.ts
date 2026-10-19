import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesDirectory = import.meta.dirname;
const i18nCss = readFileSync(resolve(stylesDirectory, "i18n.css"), "utf8");
const normalizedI18nCss = i18nCss.replace(/\s+/g, " ");
const indexCss = readFileSync(resolve(stylesDirectory, "index.css"), "utf8");
const docsCssPath = resolve(stylesDirectory, "../../../catalog/src/docs/docs.css");
const hasDocsCss = existsSync(docsCssPath);
const docsCss = hasDocsCss ? readFileSync(docsCssPath, "utf8") : "";
const normalizedDocsCss = docsCss.replace(/\s+/g, " ");

describe("script-aware typography", () => {
  it("sets Japanese and Chinese text behavior and Japanese font stack", () => {
    expect(normalizedI18nCss).toContain(
      ":lang(ja), :lang(zh) { text-autospace: normal; line-break: strict;",
    );
    expect(normalizedI18nCss).toContain("body:lang(ja), body:lang(zh) { line-height: 1.75;");
    expect(i18nCss).toMatch(
      /:lang\(ja\)\s*\{\s*font-family:\s*var\(\s*--font-sans-ja,\s*"Hiragino Sans",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic UI",\s*"Noto Sans JP",\s*var\(--font-sans\)\s*\);/,
    );
    expect(i18nCss).toMatch(
      /:lang\(zh-Hans\)\s*\{\s*font-family:\s*var\(\s*--font-sans-zh-hans,\s*"PingFang SC",\s*"Microsoft YaHei UI",\s*"Noto Sans SC",\s*var\(--font-sans\)\s*\);/,
    );
    expect(normalizedI18nCss).toContain(":lang(ja) :is(h1, h2, h3) { word-break: auto-phrase;");
  });

  it("uses an Arabic font stack, relaxed line height, and normal tracking", () => {
    expect(normalizedI18nCss).toContain("body:lang(ar) { line-height: 1.8;");
    expect(normalizedI18nCss).toContain(
      ':lang(ar) { letter-spacing: normal; font-family: var(--font-sans-ar, "SF Arabic", "Segoe UI", "Noto Sans Arabic", var(--font-sans));',
    );
  });

  it("turns off uppercase chart captions for CJK and Arabic locales", () => {
    expect(normalizedI18nCss).toContain(
      ":lang(ja) [data-uiify-line-chart] > figcaption, :lang(zh) [data-uiify-line-chart] > figcaption, :lang(ar) [data-uiify-line-chart] > figcaption, :lang(ja) [data-uiify-candle-chart] > figcaption, :lang(zh) [data-uiify-candle-chart] > figcaption, :lang(ar) [data-uiify-candle-chart] > figcaption { text-transform: none;",
    );
  });

  it("is imported by the styles entry and avoids compatibility branches", () => {
    expect(indexCss).toContain('@import url("./i18n.css");');
    expect(i18nCss).not.toContain("@supports");
  });

  it.skipIf(!hasDocsCss)("applies the script stacks and prose behavior to docs", () => {
    expect(docsCss).toMatch(
      /\.docs-body:lang\(ja\)\s*\{\s*font-family:\s*var\(\s*--font-sans-ja,\s*"Hiragino Sans",\s*"Hiragino Kaku Gothic ProN",\s*"Yu Gothic UI",\s*"Noto Sans JP",\s*var\(--font-sans\)\s*\);/,
    );
    expect(docsCss).toMatch(
      /\.docs-body:lang\(zh-Hans\)\s*\{\s*font-family:\s*var\(\s*--font-sans-zh-hans,\s*"PingFang SC",\s*"Microsoft YaHei UI",\s*"Noto Sans SC",\s*var\(--font-sans\)\s*\);/,
    );
    expect(normalizedDocsCss).toContain(
      '.docs-body:lang(ar) { letter-spacing: normal; font-family: var(--font-sans-ar, "SF Arabic", "Segoe UI", "Noto Sans Arabic", var(--font-sans));',
    );
    expect(normalizedDocsCss).toContain(".docs-body:lang(ar) .docs-prose__p { line-height: 1.8;");
    expect(normalizedDocsCss).toContain(
      ".docs-body:lang(ru) .docs-prose, .docs-body:lang(es) .docs-prose, .docs-body:lang(pt-BR) .docs-prose { hyphens: auto;",
    );
    expect(normalizedDocsCss).toContain(".docs-prose code { unicode-bidi: isolate;");
  });
});
