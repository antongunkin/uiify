export function normalizeCss(css: string): string {
  return css
    .replace(/\s+/g, "")
    .replace(/["']/g, "")
    .replace(/::(before|after)/g, ":$1");
}
