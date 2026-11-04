import { describe, expect, it } from "vitest";
import { createComboboxItems } from "./combobox-items.js";

describe("createComboboxItems", () => {
  it("preserves record identity, source order, disabled state, and duplicate labels", () => {
    const people = [
      { id: "ada", name: "Alex", active: false },
      { id: "grace", name: "Alex", active: true },
    ] as const;
    const collection = createComboboxItems(people, {
      getValue: (person) => person.id,
      getLabel: (person) => person.name,
      isDisabled: (person) => !person.active,
    });

    expect(collection.items).toEqual([
      { value: "ada", label: "Alex", disabled: true },
      { value: "grace", label: "Alex", disabled: false },
    ]);
    expect(collection.getItem("ada")).toBe(people[0]);
    expect(collection.getItem("missing")).toBeUndefined();
  });

  it("allows an empty value and does not mutate frozen records", () => {
    const records = Object.freeze([Object.freeze({ id: "", label: "Empty ID" })]);
    const collection = createComboboxItems(records, {
      getValue: (record) => record.id,
      getLabel: (record) => record.label,
    });

    expect(collection.items[0]?.value).toBe("");
    expect(collection.getItem("")).toBe(records[0]);
    expect(records[0]).toEqual({ id: "", label: "Empty ID" });
  });

  it("rejects duplicate IDs and creates a fresh adapter for refreshed records", () => {
    const getValue = (record: { id: string }) => record.id;
    const getLabel = (record: { label: string }) => record.label;
    expect(() =>
      createComboboxItems(
        [
          { id: "duplicate", label: "A" },
          { id: "duplicate", label: "B" },
        ],
        {
          getValue,
          getLabel,
        },
      ),
    ).toThrow('Duplicate Combobox item value "duplicate"');

    const firstRecord = { id: "ada", label: "Ada" };
    const secondRecord = { id: "ada", label: "Ada Lovelace" };
    const first = createComboboxItems([firstRecord], { getValue, getLabel });
    const refreshed = createComboboxItems([secondRecord], { getValue, getLabel });
    expect(refreshed).not.toBe(first);
    expect(refreshed.items[0]?.label).toBe("Ada Lovelace");
    expect(refreshed.getItem("ada")).toBe(secondRecord);
  });
});
