import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeCss } from "./test-css.js";

const stylesDirectory = import.meta.dirname;
const i18nCss = readFileSync(resolve(stylesDirectory, "i18n.css"), "utf8");
const normalizedI18nCss = i18nCss.replace(/\s+/g, " ");
const indexCss = readFileSync(resolve(stylesDirectory, "index.css"), "utf8");
const lineChartCss = readFileSync(
  resolve(stylesDirectory, "../../dist/styles/uiify/line-chart.css"),
  "utf8",
);
const candleChartCss = readFileSync(
  resolve(stylesDirectory, "../../dist/styles/uiify/candle-chart.css"),
  "utf8",
);

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
    expect(normalizeCss(lineChartCss)).toContain(
      normalizeCss(".uiify-line-chart-caption:lang(ja)"),
    );
    expect(normalizeCss(candleChartCss)).toContain(
      normalizeCss(".uiify-candle-chart-caption:lang(ja)"),
    );
  });

  it("is imported by the styles entry and avoids compatibility branches", () => {
    expect(indexCss).toContain('@import url("./i18n.css");');
    expect(i18nCss).not.toContain("@supports");
  });
});
