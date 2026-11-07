import { compile } from "@tailwindcss/node";
import postcss, { type AtRule } from "postcss";
import { describe, expect, it } from "vitest";

/**
 * The consumer setup from the adapter header. Behavior must sit below the recipes and below every
 * utility, so a consumer's `className` and `components.app` rules always win over it.
 */
const consumerEntry = `
@import "tailwindcss";
@import "./tailwind.css";
@import "./generated/uiify.css";
`;

/** Full layer names (`components.ui.behavior`) in order of first appearance. */
function layerOrder(css: string) {
  const order: string[] = [];
  postcss.parse(css).walkAtRules("layer", (rule) => {
    const parents: string[] = [];
    for (let node = rule.parent; node; node = node.parent as AtRule["parent"]) {
      if (node.type === "atrule" && (node as AtRule).name === "layer") {
        parents.unshift((node as AtRule).params.trim());
      }
    }
    for (const name of rule.params.split(",").map((part) => part.trim())) {
      if (!name) continue;
      const parts = [...parents, name].join(".").split(".");
      for (let index = 1; index <= parts.length; index += 1) {
        const layer = parts.slice(0, index).join(".");
        if (!order.includes(layer)) order.push(layer);
      }
    }
  });
  return order;
}

describe("Tailwind adapter cascade layers", () => {
  it("puts behavior below recipes, consumer overrides and utilities", async () => {
    const compiler = await compile(consumerEntry, { base: import.meta.dirname, onDependency() {} });
    const order = layerOrder(compiler.build([]));
    const topLevel = order.filter((layer) => !layer.includes("."));
    const components = order.filter((layer) => /^components\.[^.]+$/.test(layer));

    expect(topLevel).toEqual(["properties", "theme", "base", "components", "utilities"]);
    expect(components).toEqual(["components.ui", "components.uiify", "components.app"]);
    expect(order).toContain("components.ui.behavior");
  });
});
