import { describe, expect, it } from "vitest";
import {
  canAddComboboxValue,
  normalizeComboboxValue,
  splitComboboxValues,
} from "./combobox-values.js";
import type { ComboboxRootMultiProps, ComboboxRootSingleProps } from "./types.js";

describe("Combobox value helpers", () => {
  it("keeps single and multi value callbacks type-safe", () => {
    const singleProps = {
      items: [],
      onValueChange: (value: string) => value,
    } satisfies ComboboxRootSingleProps;
    const multiProps = {
      items: [],
      multiple: true,
      onValueChange: (values: string[]) => values,
    } satisfies ComboboxRootMultiProps;

    expect(singleProps.onValueChange).toBeTypeOf("function");
    expect(multiProps.onValueChange).toBeTypeOf("function");
  });

  it("normalizes and splits multi-value input", () => {
    expect(normalizeComboboxValue("  React  ")).toBe("React");
    expect(splitComboboxValues("React, UI\nCSS", [","])).toEqual(["React", "UI", "CSS"]);
  });

  it("splits on delimiters, newlines, and tabs", () => {
    expect(splitComboboxValues("React;\nUI\tCSS", [";"])).toEqual(["React", "UI", "CSS"]);
  });

  it("rejects invalid multi-values", () => {
    const options = { maxValues: 2, validateValue: (value: string) => value.length > 2 };
    expect(canAddComboboxValue("  ", ["React"], options)).toBe(false);
    expect(canAddComboboxValue("React", ["React"], options)).toBe(false);
    expect(canAddComboboxValue("UI", ["React"], options)).toBe(false);
    expect(canAddComboboxValue("Vue", ["React", "Svelte"], options)).toBe(false);
  });

  it("accepts a valid new value", () => {
    expect(canAddComboboxValue(" Vue ", ["React"], { maxValues: 2 })).toBe(true);
  });
});
