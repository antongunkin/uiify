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

export function parseNumber(input: string, formatter: Intl.NumberFormat): number | undefined {
  const trimmed = input.trim();
  if (trimmed === "") return undefined;

  const parts = formatter.formatToParts(12345.6);
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  const group = parts.find((part) => part.type === "group")?.value ?? ",";
  const normalized = trimmed
    .replaceAll(group, "")
    .replace(decimal, ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
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
