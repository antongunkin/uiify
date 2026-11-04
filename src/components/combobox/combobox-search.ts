import type { ComboboxFilterFn, ComboboxItemData } from "./types.js";

function normalize(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

export function createComboboxFilter(items: readonly ComboboxItemData[]): ComboboxFilterFn {
  const index = new Map<string, { readonly label: string; readonly normalizedLabel: string }>();
  for (const item of items) {
    if (index.has(item.value)) {
      throw new Error(`Duplicate Combobox item value "${item.value}"`);
    }
    index.set(item.value, { label: item.label, normalizedLabel: normalize(item.label) });
  }

  return (subset, inputValue) => {
    const query = normalize(inputValue.trim());
    if (!query) return [...subset];
    return subset.filter((item) => {
      const indexed = index.get(item.value);
      const normalizedLabel =
        indexed?.label === item.label ? indexed.normalizedLabel : normalize(item.label);
      return normalizedLabel.includes(query);
    });
  };
}
