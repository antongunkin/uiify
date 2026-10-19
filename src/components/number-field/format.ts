export function clampNumber(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
}

export function createFormatter(
  locale: string,
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, options);
}

export function formatNumber(value: number, formatter: Intl.NumberFormat): string {
  return formatter.format(value);
}

const BIDI_CONTROL = /\p{Bidi_Control}/gu;
const digitMaps = new WeakMap<Intl.NumberFormat, ReadonlyMap<string, string>>();

function fold(value: string): string {
  return value.normalize("NFKC").replace(BIDI_CONTROL, "");
}

function nativeDigits(formatter: Intl.NumberFormat): ReadonlyMap<string, string> {
  let map = digitMaps.get(formatter);
  if (!map) {
    const { locale, numberingSystem } = formatter.resolvedOptions();
    const digits = new Intl.NumberFormat(locale, { numberingSystem, useGrouping: false });
    const entries = new Map<string, string>();
    for (let digit = 0; digit <= 9; digit += 1) {
      const native = fold(digits.format(digit));
      if (native !== String(digit)) entries.set(native, String(digit));
    }
    map = entries;
    digitMaps.set(formatter, map);
  }
  return map;
}

function normalizeInput(input: string, formatter: Intl.NumberFormat): string {
  const parts = formatter.formatToParts(-12345.6);
  const decimal = fold(parts.find((part) => part.type === "decimal")?.value ?? ".");
  const group = fold(parts.find((part) => part.type === "group")?.value ?? ",");
  let normalized = fold(input.trim());
  for (const [native, ascii] of nativeDigits(formatter)) {
    normalized = normalized.replaceAll(native, ascii);
  }
  normalized = normalized.replaceAll(group, "").replace(decimal, ".");
  for (const part of parts) {
    const value = fold(part.value);
    if (
      part.type === "currency" ||
      part.type === "unit" ||
      part.type === "literal" ||
      part.type === "percentSign"
    )
      normalized = normalized.replaceAll(value, "");
    if (part.type === "minusSign") normalized = normalized.replaceAll(value, "-");
  }
  return normalized.replace(/\s/g, "");
}

export function isNumberInput(input: string, formatter: Intl.NumberFormat): boolean {
  return /^[+-]?\d*(?:\.\d*)?$/.test(normalizeInput(input, formatter));
}

export function parseNumber(input: string, formatter: Intl.NumberFormat): number | undefined {
  const normalized = normalizeInput(input, formatter);
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return undefined;
  const parsed = Number(normalized) / (formatter.resolvedOptions().style === "percent" ? 100 : 1);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function stepNumber(
  value: number,
  delta: number,
  step: number,
  min?: number,
  max?: number,
): number {
  const precision = step.toString().includes(".")
    ? (step.toString().split(".")[1]?.length ?? 0)
    : 0;
  const next = Number((value + delta * step).toFixed(precision));
  return clampNumber(next, min, max);
}
