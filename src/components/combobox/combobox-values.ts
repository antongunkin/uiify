import type { ComboboxMultiValueOptions } from "./types.js";

export function normalizeComboboxValue(value: string): string {
  return value.trim();
}

export function splitComboboxValues(text: string, delimiters: readonly string[]): string[] {
  const separators = [...delimiters, "\n", "\r", "\t"]
    .filter((delimiter) => delimiter.length > 0)
    .map((delimiter) => delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = separators.length > 0 ? new RegExp(separators.join("|"), "g") : /[\n\r\t]/g;

  return text.split(pattern).map(normalizeComboboxValue).filter(Boolean);
}

export function canAddComboboxValue(
  value: string,
  selectedValues: readonly string[],
  options: ComboboxMultiValueOptions,
): boolean {
  const normalizedValue = normalizeComboboxValue(value);
  if (normalizedValue.length === 0 || selectedValues.includes(normalizedValue)) return false;
  if (options.maxValues !== undefined && selectedValues.length >= options.maxValues) return false;
  return options.validateValue?.(normalizedValue) ?? true;
}
