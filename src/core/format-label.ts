export function formatLabel(
  template: string,
  values: Readonly<Record<string, string | number>>,
  locale?: string,
): string {
  const numberFormat = new Intl.NumberFormat(locale ?? "en-US");

  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
    if (!Object.hasOwn(values, key)) return placeholder;

    const value = values[key];
    if (value === undefined) return placeholder;

    return typeof value === "number" ? numberFormat.format(value) : value;
  });
}
