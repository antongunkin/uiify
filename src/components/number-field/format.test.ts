import { describe, expect, it } from "vitest";
import { isNumberInput, parseNumber } from "./format.js";

const fmt = (l: string, n: number) => new Intl.NumberFormat(l).format(n);

const cases: Array<[string, string, number]> = [
  ["en-US", "12,345.6", 12345.6],
  ["de-DE", "12.345,6", 12345.6],
  ["fr-FR", fmt("fr-FR", 12345.6), 12345.6],
  ["de-CH", fmt("de-CH", 12345.6), 12345.6],
  ["ar-EG", fmt("ar-EG", 12345.6), 12345.6],
  ["ar-EG", fmt("ar-EG", -42), -42],
  ["ar-EG", "12345.6", 12345.6],
  ["fa-IR", fmt("fa-IR", -42), -42],
  ["he-IL", fmt("he-IL", -42), -42],
  ["ja-JP", "１２３", 123],
  ["ja-JP", "－５", -5],
  ["zh-CN", "１２，３４５．６", 12345.6],
  ["hi-IN-u-nu-deva", fmt("hi-IN-u-nu-deva", 1500), 1500],
];

describe("parseNumber", () => {
  it.each(cases)("parses %s %j", (locale, input, want) => {
    expect(parseNumber(input, new Intl.NumberFormat(locale))).toBe(want);
  });

  it.each([
    "en-US",
    "de-DE",
    "fr-FR",
    "de-CH",
    "ar-EG",
    "fa-IR",
    "he-IL",
    "hi-IN-u-nu-deva",
    "ja-JP",
  ])("round-trips its own output in %s", (locale) => {
    const formatter = new Intl.NumberFormat(locale);
    for (const value of [0, -42, 12345.6]) {
      expect(parseNumber(formatter.format(value), formatter)).toBe(value);
    }
  });
});

describe("isNumberInput", () => {
  it("accepts partial native-digit typing", () => {
    expect(isNumberInput("١٢", new Intl.NumberFormat("ar-EG"))).toBe(true);
    expect(isNumberInput("", new Intl.NumberFormat("ar-EG"))).toBe(true);
    expect(isNumberInput("abc", new Intl.NumberFormat("ar-EG"))).toBe(false);
  });
});
