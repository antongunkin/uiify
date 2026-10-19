import { describe, expect, it } from "vitest";
import { defaultComboboxFilter } from "./combobox-store.js";

const labels = (items: ReturnType<typeof defaultComboboxFilter>) => items.map((i) => i.label);
const items = (...names: string[]) => names.map((label) => ({ label, value: label }));

describe("defaultComboboxFilter", () => {
  it("matches half-width kana with a full-width query", () => {
    expect(labels(defaultComboboxFilter(items("ｶﾀｶﾅ", "other"), "カタ"))).toEqual(["ｶﾀｶﾅ"]);
  });

  it("matches full-width latin with an ascii query", () => {
    expect(labels(defaultComboboxFilter(items("ＡＢＣ", "xyz"), "abc"))).toEqual(["ＡＢＣ"]);
  });

  it("does not strip Japanese dakuten", () => {
    expect(defaultComboboxFilter(items("が"), "か")).toEqual([]);
  });
});
