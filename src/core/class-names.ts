/** Join library and consumer class names; empty input yields no `class` attribute. */
export function cn(...parts: Array<string | false | null | undefined>): string | undefined {
  return parts.filter(Boolean).join(" ") || undefined;
}
