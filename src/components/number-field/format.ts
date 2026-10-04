export function clampNumber(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
}

export function createFormatter(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  return new Intl.NumberFormat(undefined, options);
}

export function formatNumber(value: number, formatter: Intl.NumberFormat): string {
  return formatter.format(value);
}

function normalizeInput(input: string, formatter: Intl.NumberFormat): string {
  const parts = formatter.formatToParts(-12345.6);
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  const group = parts.find((part) => part.type === "group")?.value ?? ",";
  let normalized = input.trim().replaceAll(group, "").replace(decimal, ".");
  for (const part of parts) {
    if (
      part.type === "currency" ||
      part.type === "unit" ||
      part.type === "literal" ||
      part.type === "percentSign"
    )
      normalized = normalized.replaceAll(part.value, "");
    if (part.type === "minusSign") normalized = normalized.replaceAll(part.value, "-");
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
