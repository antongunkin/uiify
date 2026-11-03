import { layoutConditions, layoutPartProps } from "./values.js";
import type { LayoutPart } from "./types.js";

export function layoutAttributeName(prop: string, condition = "base"): string {
  const name = prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return `data-${condition === "base" ? "" : `${condition}-`}${name}`;
}

/** Only declared own props are serialized. Consumer DOM props are applied afterwards. */
export function layoutAttributes(
  kind: LayoutPart,
  props: Readonly<Record<string, unknown>>,
): Record<string, string | number> {
  const attributes: Record<string, string | number> =
    kind === "Text" || kind === "Heading"
      ? { "data-ui-text": kind.toLowerCase() }
      : { "data-ui-layout": kind === "GridItem" ? "grid-item" : kind.toLowerCase() };
  for (const prop of Object.keys(layoutPartProps[kind])) {
    const value = props[prop];
    if (value === undefined || prop === "level") continue;
    if (value !== null && typeof value === "object") {
      for (const condition of layoutConditions) {
        const item = (value as Readonly<Record<string, unknown>>)[condition];
        if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
          attributes[layoutAttributeName(prop, condition)] =
            typeof item === "boolean" ? String(item) : item;
        }
      }
    } else if (typeof value === "string" || typeof value === "number" || value === true) {
      attributes[layoutAttributeName(prop)] = value === true ? "true" : value;
    }
  }
  return attributes;
}
