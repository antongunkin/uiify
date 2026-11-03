import { layoutBreakpoints, layoutConditions, layoutParts } from "../../core/layout/index.js";
import type { LayoutCondition, LayoutPart } from "../../core/layout/index.js";
import {
  layoutControlSelector,
  layoutDeclarationInputs,
  resolveLayoutDeclarations,
} from "./declarations.js";
export { layoutTailwindManifest } from "./tailwind-manifest.generated.js";

function variant(condition: LayoutCondition, viewport: boolean): string {
  return condition === "base" ? "" : `${viewport ? "" : "@"}min-[${layoutBreakpoints[condition]}]:`;
}
function utility(property: string, value: string): string {
  return `[${property}:${value.replace(/\s+/g, "_")}]`;
}
/** Complete, prebuildable utility strings; no browser stylesheet compiler is required. */
export function layoutTailwindClasses(
  kind: LayoutPart,
  props: Readonly<Record<string, unknown>>,
): string {
  const resolved = resolveLayoutDeclarations(kind, props);
  const classes: string[] = [];
  for (const condition of layoutConditions) {
    const prefix = variant(condition, props.responsive === "viewport");
    for (const [property, value] of Object.entries(resolved[condition]))
      classes.push(`${prefix}${utility(property, value)}`);
    if (kind === "Stack") {
      const source = props.direction;
      const direction =
        source !== null && typeof source === "object"
          ? (source as Readonly<Record<string, unknown>>)[condition]
          : condition === "base"
            ? source
            : undefined;
      if (direction !== undefined || condition === "base")
        classes.push(
          `${prefix}[&>${layoutControlSelector}]:${utility("max-inline-size", direction === "inline" ? "revert-layer" : "none")}`,
        );
    }
  }
  return classes.join(" ");
}

/** Enumerates the finite vocabulary, including defaults, resets and both query bases. */
export function createLayoutTailwindManifest(): string[] {
  const classes = new Set<string>();
  const add = (kind: LayoutPart, props: Readonly<Record<string, unknown>>) => {
    for (const item of layoutTailwindClasses(kind, props).split(" ")) if (item) classes.add(item);
  };
  for (const kind of layoutParts) add(kind, {});
  for (const [kind, prop, value] of layoutDeclarationInputs()) {
    add(kind, { [prop]: value });
    if (prop === "container" || prop === "responsive" || prop === "level") continue;
    for (const condition of layoutConditions.slice(1)) {
      add(kind, { [prop]: { [condition]: value } });
      add(kind, { [prop]: { [condition]: value }, responsive: "viewport" });
    }
  }
  return [...classes].sort();
}
