import type {
  ComboboxItemAdapterOptions,
  ComboboxItemCollection,
  ComboboxItemData,
} from "./types.js";

export function createComboboxItems<T>(
  records: readonly T[],
  options: ComboboxItemAdapterOptions<T>,
): ComboboxItemCollection<T> {
  const items: ComboboxItemData[] = [];
  const recordsByValue = new Map<string, T>();

  for (const record of records) {
    const value = options.getValue(record);
    if (recordsByValue.has(value)) {
      throw new Error(`Duplicate Combobox item value "${value}"`);
    }
    recordsByValue.set(value, record);
    items.push({
      value,
      label: options.getLabel(record),
      disabled: options.isDisabled?.(record) ?? false,
    });
  }

  return {
    items,
    getItem: (value) => recordsByValue.get(value),
  };
}
