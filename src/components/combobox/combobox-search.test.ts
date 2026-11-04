import { describe, expect, it } from "vitest";
import { createComboboxFilter } from "./combobox-search.js";

describe("createComboboxFilter", () => {
  it("matches default normalization while preserving subset order and source identity", () => {
    const source = [
      { label: "Café", value: "one" },
      { label: "カタカナ", value: "two" },
      { label: "Cafe\u0301", value: "three", disabled: true },
      { label: "Other", value: "four" },
    ];
    const filter = createComboboxFilter(source);
    const subset = [source[2]!, source[1]!, source[0]!];

    expect(filter(subset, "  CAFÉ ")).toEqual([source[2], source[0]]);
    expect(filter(subset, "ｶﾀｶﾅ")).toEqual([source[1]]);
    expect(filter(subset, "")).toEqual(subset);
    expect(source).toHaveLength(4);
  });

  it("uses current labels for refreshed and unknown subset objects", () => {
    const filter = createComboboxFilter([{ label: "Old label", value: "same" }]);
    const current = { label: "New label", value: "same" };
    const newItem = { label: "New person", value: "new" };

    expect(filter([current], "old")).toEqual([]);
    expect(filter([current], "new")).toEqual([current]);
    expect(filter([newItem], "person")).toEqual([newItem]);
  });

  it("rejects duplicate source IDs and accepts duplicate labels and empty IDs", () => {
    expect(() =>
      createComboboxFilter([
        { label: "Same", value: "duplicate" },
        { label: "Same", value: "duplicate" },
      ]),
    ).toThrow('Duplicate Combobox item value "duplicate"');
    const filter = createComboboxFilter([
      { label: "Same", value: "" },
      { label: "Same", value: "two" },
    ]);
    expect(filter([{ label: "Same", value: "two" }], "same")).toEqual([
      { label: "Same", value: "two" },
    ]);
  });
});
